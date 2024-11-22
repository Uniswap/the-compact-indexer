import { ponder } from "@/generated";
import { zeroAddress } from "viem";
import * as schema from "../ponder.schema";

// Reset period values in seconds
const ResetPeriod = {
  OneSecond: 1,
  FifteenSeconds: 15,
  OneMinute: 60,
  TenMinutes: 600,
  OneHourAndFiveMinutes: 3900,
  OneDay: 86400,
  SevenDaysAndOneHour: 612000,
  ThirtyDays: 2592000,
};

enum Scope {
  Multichain,
  ChainSpecific,
}

enum ForcedWithdrawalStatus {
  Pending,
  Enabled,
  Disabled,
}

// Unified event handlers for all networks
ponder.on("TheCompact:AllocatorRegistered", async ({ event, context }) => {
  const { allocator, allocatorId } = event.args;
  const chainId = context.network.chainId;

  await context.db
    .insert(schema.allocator)
    .values({
      address: allocator,
      first_seen_at: event.block.timestamp,
    })
    .onConflictDoNothing();

  await context.db.insert(schema.allocator_registration).values({
    allocator_address: allocator,
    chain_id: BigInt(chainId),
    registered_at: event.block.timestamp,
  });

  await context.db.insert(schema.allocator_chain_id).values({
    allocator_address: allocator,
    allocator_id: BigInt(allocatorId),
    chain_id: BigInt(chainId),
    first_seen_at: event.block.timestamp,
  });
});

ponder.on("TheCompact:Transfer", async ({ event, context }) => {
  const { by, from, to, id, amount } = event.args;
  const chainId = BigInt(context.network.chainId);
  const transferAmount = BigInt(amount);

  // Extract token address from the last 160 bits of the ID
  const tokenAddress = `0x${id
    .toString(16)
    .padStart(64, "0")
    .slice(-40)}` as const;

  // Handle mints and burns
  const isMint = from === zeroAddress;
  const isBurn = to === zeroAddress;

  // Extract reset period and scope from amount
  const resetPeriodIndex = Number((amount >> 252n) & 0x7n);
  const scope = Number((amount >> 255n) & 0x1n);
  const resetPeriod = Object.values(ResetPeriod)[resetPeriodIndex]!;
  const isMultichain = scope === Scope.Multichain;

  if (isMint) {
    await context.db
      .insert(schema.deposited_token)
      .values({
        chain_id: chainId,
        token_address: tokenAddress,
        first_seen_at: event.block.timestamp,
        total_supply: transferAmount,
      })
      .onConflictDoUpdate((row) => ({
        total_supply: row.total_supply + transferAmount,
      }));

    await context.db
      .insert(schema.resource_lock)
      .values({
        lock_id: id,
        chain_id: chainId,
        token_address: tokenAddress,
        allocator_address: by,
        reset_period: BigInt(resetPeriod),
        is_multichain: isMultichain,
        minted_at: event.block.timestamp,
        total_supply: transferAmount,
      })
      // TODO: Is this correct?
      .onConflictDoNothing();
  } else if (isBurn) {
    const existingToken = await context.db.find(schema.deposited_token, {
      token_address: tokenAddress,
      chain_id: chainId,
    });
    const existingLock = await context.db.find(schema.resource_lock, {
      lock_id: id,
      chain_id: chainId,
    });

    if (existingToken && existingLock) {
      await context.db
        .update(schema.deposited_token, {
          token_address: tokenAddress,
          chain_id: chainId,
        })
        .set({
          total_supply: existingToken.total_supply - transferAmount,
        });

      await context.db
        .update(schema.resource_lock, { lock_id: id, chain_id: chainId })
        .set({
          total_supply: existingLock.total_supply - transferAmount,
        });
    }
  }

  // Update sender balances (unless minting)
  if (!isMint) {
    // Ensure sender account exists
    await context.db
      .insert(schema.account)
      .values({
        address: from,
        first_seen_at: event.block.timestamp,
      })
      .onConflictDoNothing();

    // Update token-level balance
    const existingFromTokenBalance = await context.db.find(
      schema.account_token_balance,
      { account_address: from, token_address: tokenAddress, chain_id: chainId }
    );

    // Note: is it an invariant that `existingFromTokenBalance` and `account_resource_lock_balance` are always defined?

    if (existingFromTokenBalance) {
      await context.db
        .update(schema.account_token_balance, {
          account_address: from,
          token_address: tokenAddress,
          chain_id: chainId,
        })
        .set({
          balance: existingFromTokenBalance.balance - transferAmount,
          last_updated_at: event.block.timestamp,
        });
    }

    // Update resource lock balance
    const existingFromResourceLockBalance = await context.db.find(
      schema.account_resource_lock_balance,
      { account_address: from, resource_lock: id, chain_id: chainId }
    );

    if (existingFromResourceLockBalance) {
      await context.db
        .update(schema.account_resource_lock_balance, {
          account_address: from,
          resource_lock: id,
          chain_id: chainId,
        })
        .set({
          balance: existingFromResourceLockBalance.balance - transferAmount,
          last_updated_at: event.block.timestamp,
        });
    }
  }

  // Update receiver balances (unless burning)
  if (!isBurn) {
    // Ensure receiver account exists
    await context.db
      .insert(schema.account)
      .values({
        address: to,
        first_seen_at: event.block.timestamp,
      })
      .onConflictDoNothing();

    // Update token-level balance

    await context.db
      .insert(schema.account_token_balance)
      .values({
        account_address: to,
        token_address: tokenAddress,
        chain_id: chainId,
        balance: transferAmount,
        last_updated_at: event.block.timestamp,
      })
      .onConflictDoUpdate((row) => ({
        balance: row.balance + transferAmount,
        last_updated_at: event.block.timestamp,
      }));

    // Update resource lock balance
    await context.db
      .insert(schema.account_resource_lock_balance)
      .values({
        account_address: to,
        resource_lock: id,
        chain_id: chainId,
        token_address: tokenAddress,
        balance: transferAmount,
        last_updated_at: event.block.timestamp,
      })
      .onConflictDoUpdate((row) => ({
        balance: row.balance + transferAmount,
        last_updated_at: event.block.timestamp,
      }));
  }
});

ponder.on(
  "TheCompact:ForcedWithdrawalStatusUpdated",
  async ({ event, context }) => {
    const {
      account: accountAddress,
      id,
      activating,
      withdrawableAt,
    } = event.args;
    const chainId = BigInt(context.network.chainId);
    const timestamp = BigInt(event.block.timestamp);

    // Get the balance record
    const existingBalance = await context.db.find(
      schema.account_resource_lock_balance,
      {
        account_address: accountAddress,
        resource_lock: id,
        chain_id: chainId,
      }
    );

    if (existingBalance) {
      if (activating) {
        // Determine status based on withdrawableAt
        const withdrawableAtBigInt = BigInt(withdrawableAt);
        const status =
          withdrawableAtBigInt > timestamp
            ? ForcedWithdrawalStatus.Pending
            : ForcedWithdrawalStatus.Enabled;

        await context.db
          .update(schema.account_resource_lock_balance, {
            account_address: accountAddress,
            resource_lock: id,
            chain_id: chainId,
          })
          .set({
            withdrawal_status: status,
            // Use 0n instead of null for "no withdrawal time"
            withdrawable_at:
              withdrawableAtBigInt === 0n ? 0n : withdrawableAtBigInt,
            last_updated_at: timestamp,
          });
      } else {
        await context.db
          .update(schema.account_resource_lock_balance, {
            account_address: accountAddress,
            resource_lock: id,
            chain_id: chainId,
          })
          .set({
            withdrawal_status: ForcedWithdrawalStatus.Disabled,
            withdrawable_at: 0n, // Use 0n for disabled state
            last_updated_at: timestamp,
          });
      }
    }
  }
);

ponder.on("TheCompact:Claim", async ({ event, context }) => {
  const { sponsor, allocator, arbiter, claimHash } = event.args;
  const chainId = context.network.chainId;

  // Ensure sponsor account exists
  await context.db
    .insert(schema.account)
    .values({
      address: sponsor,
      first_seen_at: event.block.timestamp,
    })
    .onConflictDoNothing();

  // Ensure allocator exists
  await context.db
    .insert(schema.account)
    .values({
      address: allocator,
      first_seen_at: event.block.timestamp,
    })
    .onConflictDoNothing();

  // Create claim record

  // NOTE: Do we need allocator_id?
  await context.db.insert(schema.claim).values({
    claim_hash: claimHash,
    chain_id: BigInt(chainId),
    sponsor,
    allocator,
    arbiter,
    timestamp: event.block.timestamp,
    block_number: event.block.number,
  });
});

// Other events that we'll implement later
ponder.on("TheCompact:CompactRegistered", async ({ event, context }) => {
  const { sponsor, claimHash } = event.args;
  const chainId = context.network.chainId;

  // Ensure sponsor account exists
  await context.db
    .insert(schema.account)
    .values({
      address: sponsor,
      first_seen_at: event.block.timestamp,
    })
    .onConflictDoNothing();

  // Create registered compact record
  await context.db.insert(schema.registered_compact).values({
    claim_hash: claimHash,
    chain_id: BigInt(chainId),
    sponsor,
    registered_at: event.block.timestamp,
    block_number: event.block.number,
  });
});

// Other events that we'll implement later
ponder.on("TheCompact:Approval", async ({ event, context }) => {
  console.log(`Approval event on ${context.network.name}:`, {
    ...event,
    args: event.args,
    block: event.block,
    address: event.log.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
  });
});

ponder.on("TheCompact:OperatorSet", async ({ event, context }) => {
  console.log(`OperatorSet event on ${context.network.name}:`, {
    ...event,
    args: event.args,
    block: event.block,
    address: event.log.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
  });
});
