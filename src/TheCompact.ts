import { ponder } from "@/generated";
import { allocator, allocator_registration, deposited_token, resource_lock, account_token_balance, account_resource_lock_balance, account, account_resource_lock_withdrawal_status, claim, allocator_chain_id } from "../ponder.schema";

const NETWORK_TO_CHAIN_ID: Record<string, number> = {
  "mainnet": 1,
  "sepolia": 11155111,
  "base": 8453,
  "base-sepolia": 84532,
  "optimism": 10,
  "optimism-sepolia": 11155420,
  "unichain-sepolia": 1301,
};

// Reset period values in seconds
enum ResetPeriod {
  OneSecond = 1,
  FifteenSeconds = 15,
  OneMinute = 60,
  TenMinutes = 600,
  OneHourAndFiveMinutes = 3900,
  OneDay = 86400,
  SevenDaysAndOneHour = 612000,
  ThirtyDays = 2592000
}

enum Scope {
  Multichain,
  ChainSpecific
}

enum ForcedWithdrawalStatus {
  Pending,
  Enabled,
  Disabled
}

const RESET_PERIOD_VALUES = [
  ResetPeriod.OneSecond,
  ResetPeriod.FifteenSeconds,
  ResetPeriod.OneMinute,
  ResetPeriod.TenMinutes,
  ResetPeriod.OneHourAndFiveMinutes,
  ResetPeriod.OneDay,
  ResetPeriod.SevenDaysAndOneHour,
  ResetPeriod.ThirtyDays
];

async function handleAllocatorRegistered({ event, context }: any) {
  try {
    const { allocator: allocatorAddress, allocatorId } = event.args;
    const chainId = BigInt(context.network.chainId);
    const timestamp = BigInt(event.block.timestamp);

    // Normalize the allocator address
    const normalizedAllocatorAddress = allocatorAddress.toLowerCase();

    // Create or update allocator record
    const existingAllocator = await context.db.find(allocator, { id: normalizedAllocatorAddress });

    if (!existingAllocator) {
      await context.db.insert(allocator).values({
        id: normalizedAllocatorAddress,
        first_seen_at: timestamp,
      });
    }

    // Create allocator registration record
    const registrationId = `${normalizedAllocatorAddress}-${chainId}`;
    await context.db.insert(allocator_registration).values({
      id: registrationId,
      allocator_address: normalizedAllocatorAddress,
      chain_id: chainId,
      registered_at: timestamp,
    });

    // Create allocator chain ID record
    const chainSpecificId = `${normalizedAllocatorAddress}-${chainId}-${allocatorId}`;
    await context.db.insert(allocator_chain_id).values({
      id: chainSpecificId,
      allocator_address: normalizedAllocatorAddress,
      chain_id: chainId,
      allocator_id: BigInt(allocatorId),
      first_seen_at: timestamp,
    });

  } catch (error) {
    console.error("Error in handleAllocatorRegistered:", error);
    throw error;
  }
}

async function handleTransfer({ event, context }: any) {
  try {
    const { by, from, to, id, amount } = event.args;
    const chainId = BigInt(context.network.chainId);
    const transferAmount = BigInt(amount);

    // Normalize addresses to lowercase
    const fromAddress = from.toLowerCase();
    const toAddress = to.toLowerCase();
    const byAddress = by.toLowerCase();

    // Extract token address from the last 160 bits of the ID
    const tokenAddress = "0x" + id.toString(16).padStart(64, "0").slice(-40).toLowerCase();

    // Handle mints and burns
    const isMint = fromAddress === "0x0000000000000000000000000000000000000000";
    const isBurn = toAddress === "0x0000000000000000000000000000000000000000";

    // Extract reset period and scope from amount
    const resetPeriodIndex = Number((BigInt(amount) >> 252n) & 0x7n);
    const scope = Number((BigInt(amount) >> 255n) & 0x1n);
    const resetPeriod = RESET_PERIOD_VALUES[resetPeriodIndex];
    const isMultichain = scope === Scope.Multichain;

    const tokenRegistrationId = `${tokenAddress}-${chainId}`;
    const lockId = id.toString();
    const resourceLockId = `${lockId}-${chainId}`;
    const timestamp = BigInt(event.block.timestamp);

    // Handle token registration and resource lock updates
    if (isMint) {
      // Update or create token registration
      const existingToken = await context.db.find(deposited_token, { id: tokenRegistrationId });
      if (!existingToken) {
        await context.db.insert(deposited_token).values({
          id: tokenRegistrationId,
          chain_id: chainId,
          token_address: tokenAddress,
          first_seen_at: timestamp,
          total_supply: transferAmount,
        });
      } else {
        await context.db.update(deposited_token, {
          id: tokenRegistrationId
        }, {
          total_supply: existingToken.total_supply + transferAmount,
        });
      }

      // Create resource lock record
      const allocatorRegistrationId = `${byAddress}-${chainId}`;
      await context.db.insert(resource_lock).values({
        id: resourceLockId,
        lock_id: lockId,
        chain_id: chainId,
        token_registration_id: tokenRegistrationId,
        allocator_registration_id: allocatorRegistrationId,
        reset_period: BigInt(resetPeriod),
        is_multichain: isMultichain,
        minted_at: timestamp,
        total_supply: transferAmount,
      });
    } else if (isBurn) {
      const existingToken = await context.db.find(deposited_token, { id: tokenRegistrationId });
      const existingLock = await context.db.find(resource_lock, { id: resourceLockId });

      if (existingToken && existingLock) {
        await context.db.update(deposited_token, {
          id: tokenRegistrationId
        }, {
          total_supply: existingToken.total_supply - transferAmount,
        });

        await context.db.update(resource_lock, {
          id: resourceLockId
        }, {
          total_supply: existingLock.total_supply - transferAmount,
        });
      }
    }

    // Update sender balances (unless minting)
    if (!isMint) {
      // Ensure sender account exists
      const existingFromAccount = await context.db.find(account, { id: fromAddress });
      if (!existingFromAccount) {
        await context.db.insert(account).values({
          id: fromAddress,
          first_seen_at: timestamp,
        });
      }

      // Update token-level balance
      const fromTokenBalanceId = `${fromAddress}-${tokenRegistrationId}`;
      const existingFromTokenBalance = await context.db.find(account_token_balance, { id: fromTokenBalanceId });

      if (existingFromTokenBalance) {
        await context.db.update(account_token_balance, {
          id: fromTokenBalanceId
        }, {
          balance: existingFromTokenBalance.balance - transferAmount,
          last_updated_at: timestamp,
        });
      }

      // Update resource lock balance
      const fromResourceLockBalanceId = `${fromAddress}-${resourceLockId}`;
      const existingFromResourceLockBalance = await context.db.find(account_resource_lock_balance, { id: fromResourceLockBalanceId });

      if (existingFromResourceLockBalance) {
        await context.db.update(account_resource_lock_balance, {
          id: fromResourceLockBalanceId
        }, {
          balance: existingFromResourceLockBalance.balance - transferAmount,
          last_updated_at: timestamp,
        });
      }
    }

    // Update receiver balances (unless burning)
    if (!isBurn) {
      // Ensure receiver account exists
      const existingToAccount = await context.db.find(account, { id: toAddress });
      if (!existingToAccount) {
        await context.db.insert(account).values({
          id: toAddress,
          first_seen_at: timestamp,
        });
      }

      // Update token-level balance
      const toTokenBalanceId = `${toAddress}-${tokenRegistrationId}`;
      const existingToTokenBalance = await context.db.find(account_token_balance, { id: toTokenBalanceId });

      if (existingToTokenBalance) {
        await context.db.update(account_token_balance, {
          id: toTokenBalanceId
        }, {
          balance: existingToTokenBalance.balance + transferAmount,
          last_updated_at: timestamp,
        });
      } else {
        await context.db.insert(account_token_balance).values({
          id: toTokenBalanceId,
          account_id: toAddress,
          token_registration_id: tokenRegistrationId,
          balance: transferAmount,
          last_updated_at: timestamp,
        });
      }

      // Update resource lock balance
      const toResourceLockBalanceId = `${toAddress}-${resourceLockId}`;
      const existingToResourceLockBalance = await context.db.find(account_resource_lock_balance, { id: toResourceLockBalanceId });

      if (existingToResourceLockBalance) {
        await context.db.update(account_resource_lock_balance, {
          id: toResourceLockBalanceId
        }, {
          balance: existingToResourceLockBalance.balance + transferAmount,
          last_updated_at: timestamp,
        });
      } else {
        await context.db.insert(account_resource_lock_balance).values({
          id: toResourceLockBalanceId,
          account_id: toAddress,
          resource_lock_id: resourceLockId,
          token_registration_id: tokenRegistrationId,
          balance: transferAmount,
          withdrawal_status: ForcedWithdrawalStatus.Disabled,
          last_updated_at: timestamp,
        });
      }
    }
  } catch (error) {
    console.error("Error in handleTransfer:", error);
    throw error;
  }
}

async function handleForcedWithdrawalStatusUpdated({ event, context }: any) {
  const { account: accountAddress, id, activating, withdrawableAt } = event.args;
  const chainId = BigInt(context.network.chainId);
  const timestamp = BigInt(event.block.timestamp);

  try {
    // Construct IDs
    const lockId = id.toString();
    const resourceLockId = `${lockId}-${chainId}`;
    const balanceId = `${accountAddress}-${resourceLockId}`;

    // Get the balance record
    const existingBalance = await context.db.find(account_resource_lock_balance, { id: balanceId });
    
    if (existingBalance) {
      if (activating) {
        // Determine status based on withdrawableAt
        const withdrawableAtBigInt = BigInt(withdrawableAt);
        const status = withdrawableAtBigInt > timestamp 
          ? ForcedWithdrawalStatus.Pending 
          : ForcedWithdrawalStatus.Enabled;

        // Update balance record with new withdrawal status
        await context.db.update(account_resource_lock_balance, {
          id: balanceId
        }, {
          withdrawal_status: status,
          // Use 0n instead of null for "no withdrawal time"
          withdrawable_at: withdrawableAtBigInt === 0n ? 0n : withdrawableAtBigInt,
          last_updated_at: timestamp,
        });
      } else {
        // Deactivating - set status to Disabled
        await context.db.update(account_resource_lock_balance, {
          id: balanceId
        }, {
          withdrawal_status: ForcedWithdrawalStatus.Disabled,
          withdrawable_at: 0n,  // Use 0n for disabled state
          last_updated_at: timestamp,
        });
      }
    }
    // If no balance record exists, we don't need to do anything
    // The status will be set to Disabled by default when a balance is created
  } catch (error) {
    console.error("Error in handleForcedWithdrawalStatusUpdated:", error);
    throw error;
  }
}

async function handleClaim({ event, context }: any) {
  const { sponsor, allocator: allocatorAddress, arbiter, claimHash } = event.args;
  const chainId = context.network.chainId;
  const timestamp = event.block.timestamp;

  try {
    const sponsorLower = sponsor.toLowerCase();
    const allocatorLower = allocatorAddress.toLowerCase();
    const arbiterLower = arbiter.toLowerCase();

    // Ensure account exists
    const existingAccount = await context.db.find(account, { id: sponsorLower });
    if (!existingAccount) {
      await context.db.insert(account).values({
        id: sponsorLower,
        first_seen_at: timestamp,
      });
    }

    // Ensure allocator exists
    const existingAllocator = await context.db.find(allocator, { id: allocatorLower });
    if (!existingAllocator) {
      await context.db.insert(allocator).values({
        id: allocatorLower,
        first_seen_at: timestamp,
      });
    }

    // Create claim record
    await context.db.insert(claim).values({
      id: `${claimHash}-${chainId}`,
      claim_hash: claimHash,
      chain_id: chainId,
      sponsor_id: sponsorLower,
      allocator_id: allocatorLower,
      arbiter: arbiterLower,
      timestamp,
      block_number: event.block.number,
    });
  } catch (error) {
    console.error("Error in handleClaim:", error);
    throw error;
  }
}

// Unified event handlers for all networks
ponder.on("TheCompact:AllocatorRegistered", async ({ event, context }) => {
  await handleAllocatorRegistered({ event, context });
});

ponder.on("TheCompact:Transfer", async ({ event, context }) => {
  await handleTransfer({ event, context });
});

ponder.on("TheCompact:ForcedWithdrawalStatusUpdated", async ({ event, context }) => {
  await handleForcedWithdrawalStatusUpdated({ event, context });
});

ponder.on("TheCompact:Claim", async ({ event, context }) => {
  await handleClaim({ event, context });
});

// Other events that we'll implement later
ponder.on("TheCompact:CompactRegistered", async ({ event, context }) => {
  console.log(`CompactRegistered event on ${context.network.name}:`, {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name
  });
});

ponder.on("TheCompact:Approval", async ({ event, context }) => {
  console.log(`Approval event on ${context.network.name}:`, {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name
  });
});

ponder.on("TheCompact:OperatorSet", async ({ event, context }) => {
  console.log(`OperatorSet event on ${context.network.name}:`, {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name
  });
});
