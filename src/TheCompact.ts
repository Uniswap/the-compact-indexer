import { ponder } from "@/generated";
import { zeroAddress, erc20Abi } from "viem";
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
  const chainId = BigInt(context.network.chainId);

  // Insert into allocatorLookup table
  await context.db.insert(schema.allocatorLookup).values({
    allocatorId: BigInt(allocatorId),
    chainId,
    allocatorAddress: allocator,
  });

  await context.db
    .insert(schema.allocator)
    .values({
      address: allocator,
      firstSeenAt: event.block.timestamp,
    })
    .onConflictDoNothing();

  await context.db.insert(schema.allocatorRegistration).values({
    allocatorAddress: allocator,
    chainId,
    registeredAt: event.block.timestamp,
  });

  await context.db.insert(schema.allocatorChainId).values({
    allocatorAddress: allocator,
    allocatorId: BigInt(allocatorId),
    chainId: BigInt(chainId),
    firstSeenAt: event.block.timestamp,
  });
});

ponder.on("TheCompact:Transfer", async ({ event, context }) => {
  const { from, to, id, amount } = event.args;
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

  // Extract reset period and scope from id
  const resetPeriodIndex = Number((id >> 252n) & 0x7n);
  const scope = Number((id >> 255n) & 0x1n);
  const resetPeriod = Object.values(ResetPeriod)[resetPeriodIndex]!;
  const isMultichain = scope === Scope.Multichain;

  const allocatorId = (id >> 160n) & ((1n << 92n) - 1n);

  const allocatorMapping = await context.db.find(schema.allocatorLookup, {
    allocatorId,
    chainId,
  });

  const allocatorAddress = allocatorMapping!.allocatorAddress;

  const existingLock = await context.db.find(schema.resourceLock, {
    lockId: id,
    chainId,
  });

  if (isMint) {
    await context.db
      .insert(schema.depositedToken)
      .values({
        chainId,
        tokenAddress,
        firstSeenAt: event.block.timestamp,
        totalSupply: transferAmount,
      })
      .onConflictDoUpdate((row) => ({
        totalSupply: row.totalSupply + transferAmount,
      }));

    if (!existingLock) {
      const { TheCompact } = context.contracts;

      // NOTE: decimals(id) on The Compact V0 has a bug where it always returns 0 :$
      const [ nameResult, symbolResult ] = await context.client.multicall({
        contracts: [
          {
            abi: TheCompact.abi,
            address: TheCompact.address,
            functionName: "name",
            args: [id],
          },
          {
            abi: TheCompact.abi,
            address: TheCompact.address,
            functionName: "symbol",
            args: [id],
          },
        ]
      });

      const name = nameResult?.result ?? "Unknown Resource Lock";
      const symbol = symbolResult?.result ?? "???";

      await context.db
        .insert(schema.resourceLock)
        .values({
          lockId: id,
          chainId,
          tokenAddress,
          allocatorAddress,
          resetPeriod: BigInt(resetPeriod),
          isMultichain: isMultichain,
          mintedAt: event.block.timestamp,
          totalSupply: transferAmount,
          name,
          symbol,
        })
    } else {
      await context.db
        .update(schema.resourceLock, { lockId: id, chainId })
        .set({
          totalSupply: existingLock.totalSupply + transferAmount,
        });
    }
 
    await context.db
      .insert(schema.resourceLock)
      .values({
        lockId: id,
        chainId,
        tokenAddress,
        allocatorAddress,
        resetPeriod: BigInt(resetPeriod),
        isMultichain: isMultichain,
        mintedAt: event.block.timestamp,
        totalSupply: transferAmount,
      })
      .onConflictDoUpdate((row) => ({
        totalSupply: row.totalSupply + transferAmount,
      }));
  } else if (isBurn) {
    const existingToken = await context.db.find(schema.depositedToken, {
      tokenAddress,
      chainId,
    });

    if (existingToken && existingLock) {
      await context.db
        .update(schema.depositedToken, {
          tokenAddress,
          chainId,
        })
        .set({
          totalSupply: existingToken.totalSupply - transferAmount,
        });

      await context.db
        .update(schema.resourceLock, { lockId: id, chainId: chainId })
        .set({
          totalSupply: existingLock.totalSupply - transferAmount,
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
        firstSeenAt: event.block.timestamp,
      })
      .onConflictDoNothing();

    // Update token-level balance
    const existingFromTokenBalance = await context.db.find(
      schema.accountTokenBalance,
      { accountAddress: from, tokenAddress, chainId }
    );

    // Note: is it an invariant that `existingFromTokenBalance` and `existingFromResourceLockBalance` are always defined?

    if (existingFromTokenBalance) {
      await context.db
        .update(schema.accountTokenBalance, {
          accountAddress: from,
          tokenAddress,
          chainId,
        })
        .set({
          balance: existingFromTokenBalance.balance - transferAmount,
          lastUpdatedAt: event.block.timestamp,
        });
    }

    // Update resource lock balance
    const existingFromResourceLockBalance = await context.db.find(
      schema.accountResourceLockBalance,
      { accountAddress: from, resourceLock: id, chainId }
    );

    if (existingFromResourceLockBalance) {
      await context.db
        .update(schema.accountResourceLockBalance, {
          accountAddress: from,
          resourceLock: id,
          chainId,
        })
        .set({
          balance: existingFromResourceLockBalance.balance - transferAmount,
          lastUpdatedAt: event.block.timestamp,
        });
    }

    // Insert delta
    await context.db.insert(schema.accountDelta).values({
      id: `${event.log.id}-from`,
      address: from,
      counterparty: to,
      tokenAddress,
      resourceLock: id,
      chainId,
      delta: -transferAmount,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
    });
  }

  // Update receiver balances (unless burning)
  if (!isBurn) {
    // Ensure receiver account exists
    await context.db
      .insert(schema.account)
      .values({
        address: to,
        firstSeenAt: event.block.timestamp,
      })
      .onConflictDoNothing();

    // Update token-level balance

    await context.db
      .insert(schema.accountTokenBalance)
      .values({
        accountAddress: to,
        tokenAddress,
        chainId,
        balance: transferAmount,
        lastUpdatedAt: event.block.timestamp,
      })
      .onConflictDoUpdate((row) => ({
        balance: row.balance + transferAmount,
        lastUpdatedAt: event.block.timestamp,
      }));

    // Update resource lock balance
    await context.db
      .insert(schema.accountResourceLockBalance)
      .values({
        accountAddress: to,
        resourceLock: id,
        chainId,
        tokenAddress,
        balance: transferAmount,
        lastUpdatedAt: event.block.timestamp,
      })
      .onConflictDoUpdate((row) => ({
        balance: row.balance + transferAmount,
        lastUpdatedAt: event.block.timestamp,
      }));

    // Insert delta
    await context.db.insert(schema.accountDelta).values({
      id: `${event.log.id}-to`,
      address: to,
      counterparty: from,
      tokenAddress,
      resourceLock: id,
      chainId,
      delta: transferAmount,
      blockNumber: event.block.number,
      blockTimestamp: event.block.timestamp,
    });
  }

  // Update token table
  const hasToken = await context.db
    .find(schema.token, {
      tokenAddress,
      chainId,
    })
    .then((t) => t !== undefined);

  if (hasToken === false) {
    const [nameResult, symbolResult, decimalsResult] =
      await context.client.multicall({
        contracts: [
          {
            abi: erc20Abi,
            address: tokenAddress,
            functionName: "name",
          },
          {
            abi: erc20Abi,
            address: tokenAddress,
            functionName: "symbol",
          },
          {
            abi: erc20Abi,
            address: tokenAddress,
            functionName: "decimals",
          },
        ],
      });

    const name = nameResult?.result ?? "";
    const symbol = symbolResult?.result ?? "";
    const decimals = decimalsResult?.result ?? 18;

    await context.db.insert(schema.token).values({
      tokenAddress,
      chainId,
      name,
      symbol,
      decimals,
    });
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
      schema.accountResourceLockBalance,
      {
        accountAddress,
        resourceLock: id,
        chainId,
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
          .update(schema.accountResourceLockBalance, {
            accountAddress,
            resourceLock: id,
            chainId,
          })
          .set({
            withdrawalStatus: status,
            // Use 0n instead of null for "no withdrawal time"
            withdrawableAt:
              withdrawableAtBigInt === 0n ? 0n : withdrawableAtBigInt,
            lastUpdatedAt: timestamp,
          });
      } else {
        await context.db
          .update(schema.accountResourceLockBalance, {
            accountAddress,
            resourceLock: id,
            chainId,
          })
          .set({
            withdrawalStatus: ForcedWithdrawalStatus.Disabled,
            withdrawableAt: 0n, // Use 0n for disabled state
            lastUpdatedAt: timestamp,
          });
      }
    }
  }
);

ponder.on("TheCompact:Claim", async ({ event, context }) => {
  const { sponsor, allocator, arbiter, claimHash } = event.args;
  const chainId = BigInt(context.network.chainId);

  // Ensure sponsor account exists
  await context.db
    .insert(schema.account)
    .values({
      address: sponsor,
      firstSeenAt: event.block.timestamp,
    })
    .onConflictDoNothing();

  // Ensure allocator exists
  await context.db
    .insert(schema.account)
    .values({
      address: allocator,
      firstSeenAt: event.block.timestamp,
    })
    .onConflictDoNothing();

  // Create claim record

  // NOTE: Do we need allocatorId?
  await context.db.insert(schema.claim).values({
    claimHash,
    chainId,
    sponsor,
    allocator,
    arbiter,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
  });
});

// Other events that we'll implement later
ponder.on("TheCompact:CompactRegistered", async ({ event, context }) => {
  const { sponsor, claimHash, typehash, expires } = event.args;
  const chainId = BigInt(context.network.chainId);

  // Ensure sponsor account exists
  await context.db
    .insert(schema.account)
    .values({
      address: sponsor,
      firstSeenAt: event.block.timestamp,
    })
    .onConflictDoNothing();

  // Create registered compact record
  await context.db.insert(schema.registeredCompact).values({
    claimHash,
    chainId,
    sponsor,
    timestamp: event.block.timestamp,
    blockNumber: event.block.number,
    expires: BigInt(expires),
    typehash,
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
