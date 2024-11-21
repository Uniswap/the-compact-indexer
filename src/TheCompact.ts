import { ponder } from "@/generated";
import { allocator, allocator_registration, token_registration, resource_lock } from "../ponder.schema";

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
  const { allocator: allocatorAddress, allocatorId } = event.args;
  const chainId = context.network.chainId;

  try {
    // Try to find existing allocator
    const existingAllocator = await context.db.find(allocator, { id: allocatorAddress });

    // Create allocator record if it doesn't exist
    if (!existingAllocator) {
      await context.db.insert(allocator).values({
        id: allocatorAddress,
        allocator_id: allocatorId.toString(),
        first_seen_at: event.block.timestamp,
      });
    }

    // Create registration record
    const registrationId = `${allocatorAddress}-${chainId}`;
    const existingRegistration = await context.db.find(allocator_registration, { id: registrationId });

    if (!existingRegistration) {
      await context.db.insert(allocator_registration).values({
        id: registrationId,
        allocator_address: allocatorAddress,
        chain_id: chainId,
        registered_at: event.block.timestamp,
      });
    }
  } catch (error) {
    console.error("Error in handleAllocatorRegistered:", error);
    throw error;
  }
}

async function handleTransfer({ event, context }: any) {
  const { by, from, to, id, amount } = event.args;
  const chainId = BigInt(context.network.chainId);

  // Extract token address from the last 160 bits of the ID
  // Convert BigInt to hex, pad to 64 chars, take last 40 chars (20 bytes/160 bits)
  const tokenAddress = "0x" + id.toString(16).padStart(64, "0").slice(-40);

  // Only handle minting events (from zero address)
  if (from !== "0x0000000000000000000000000000000000000000") {
    return;
  }

  // Extract reset period and scope from amount
  // Bits 252-254 (3 bits) for reset period (0-7)
  // Bit 255 for scope (0 = Multichain, 1 = ChainSpecific)
  const resetPeriodIndex = Number((BigInt(amount) >> 252n) & 0x7n);
  const scope = Number((BigInt(amount) >> 255n) & 0x1n);
  const resetPeriod = RESET_PERIOD_VALUES[resetPeriodIndex];
  const isMultichain = scope === Scope.Multichain;

  try {
    // Create token registration record if it doesn't exist
    const tokenRegistrationId = `${tokenAddress}-${chainId}`;
    const existingToken = await context.db.find(token_registration, { id: tokenRegistrationId });

    if (!existingToken) {
      await context.db.insert(token_registration).values({
        id: tokenRegistrationId,
        chain_id: chainId,
        token_address: tokenAddress,
        first_seen_at: BigInt(event.block.timestamp),
      });
    }

    // Create resource lock record
    const allocatorRegistrationId = `${by}-${chainId}`;
    await context.db.insert(resource_lock).values({
      id: id.toString(),
      token_registration_id: tokenRegistrationId,
      allocator_registration_id: allocatorRegistrationId,
      reset_period: BigInt(resetPeriod),
      is_multichain: isMultichain,
      minted_at: BigInt(event.block.timestamp),
    });
  } catch (error) {
    console.error("Error in handleTransfer:", error);
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

ponder.on("TheCompact:Claim", async ({ event, context }) => {
  console.log(`Claim event on ${context.network.name}:`, {
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

ponder.on("TheCompact:ForcedWithdrawalStatusUpdated", async ({ event, context }) => {
  console.log(`ForcedWithdrawalStatusUpdated event on ${context.network.name}:`, {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name
  });
});
