import { ponder } from "@/generated";
import { allocator, allocator_registration } from "../ponder.schema";

const NETWORK_TO_CHAIN_ID: Record<string, number> = {
  "mainnet": 1,
  "sepolia": 11155111,
  "base": 8453,
  "base-sepolia": 84532,
  "optimism": 10,
  "optimism-sepolia": 11155420,
  "unichain-sepolia": 1301,
};

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

// Unified event handlers for all networks
ponder.on("TheCompact:AllocatorRegistered", async ({ event, context }) => {
  await handleAllocatorRegistered({ event, context });
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

ponder.on("TheCompact:Transfer", async ({ event, context }) => {
  console.log(`Transfer event on ${context.network.name}:`, {
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
