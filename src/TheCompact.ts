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

async function handleAllocatorRegistered({ event, context, network }: any) {
  const { allocator: allocatorAddress, allocatorId } = event.args;
  const chainId = NETWORK_TO_CHAIN_ID[network.toLowerCase()];

  if (!chainId) {
    throw new Error(`Unknown network: ${network}`);
  }

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

ponder.on("TheCompactMainnet:AllocatorRegistered", async ({ event, context }) => {
  await handleAllocatorRegistered({ event, context, network: "mainnet" });
});

ponder.on("TheCompactSepolia:AllocatorRegistered", async ({ event, context }) => {
  await handleAllocatorRegistered({ event, context, network: "sepolia" });
});

ponder.on("TheCompactBase:AllocatorRegistered", async ({ event, context }) => {
  await handleAllocatorRegistered({ event, context, network: "base" });
});

ponder.on("TheCompactBaseSepolia:AllocatorRegistered", async ({ event, context }) => {
  await handleAllocatorRegistered({ event, context, network: "base-sepolia" });
});

ponder.on("TheCompactOptimism:AllocatorRegistered", async ({ event, context }) => {
  await handleAllocatorRegistered({ event, context, network: "optimism" });
});

ponder.on("TheCompactOptimismSepolia:AllocatorRegistered", async ({ event, context }) => {
  await handleAllocatorRegistered({ event, context, network: "optimism-sepolia" });
});

ponder.on("TheCompactUnichainSepolia:AllocatorRegistered", async ({ event, context }) => {
  await handleAllocatorRegistered({ event, context, network: "unichain-sepolia" });
});

ponder.on("TheCompactMainnet:Approval", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactMainnet:Claim", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactMainnet:CompactRegistered", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactMainnet:Transfer", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactMainnet:OperatorSet", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactMainnet:ForcedWithdrawalStatusUpdated", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactSepolia:Approval", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactSepolia:Claim", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactSepolia:CompactRegistered", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactSepolia:Transfer", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactSepolia:OperatorSet", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactSepolia:ForcedWithdrawalStatusUpdated", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactBase:Approval", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactBase:Claim", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactBase:CompactRegistered", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactBase:Transfer", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactBase:OperatorSet", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactBase:ForcedWithdrawalStatusUpdated", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactBaseSepolia:Approval", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactBaseSepolia:Claim", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactBaseSepolia:CompactRegistered", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactBaseSepolia:Transfer", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactBaseSepolia:OperatorSet", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactBaseSepolia:ForcedWithdrawalStatusUpdated", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactOptimism:Approval", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactOptimism:Claim", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactOptimism:CompactRegistered", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactOptimism:Transfer", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactOptimism:OperatorSet", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactOptimism:ForcedWithdrawalStatusUpdated", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactOptimismSepolia:Approval", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactOptimismSepolia:Claim", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactOptimismSepolia:CompactRegistered", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactOptimismSepolia:Transfer", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactOptimismSepolia:OperatorSet", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactOptimismSepolia:ForcedWithdrawalStatusUpdated", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactUnichainSepolia:Approval", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactUnichainSepolia:Claim", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactUnichainSepolia:CompactRegistered", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactUnichainSepolia:Transfer", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactUnichainSepolia:OperatorSet", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});

ponder.on("TheCompactUnichainSepolia:ForcedWithdrawalStatusUpdated", async ({ event, context }) => {
  console.log("Full event object:", {
    ...event,
    args: event.args,
    block: event.block,
    address: event.address,
    eventName: event.eventName,
    source: event.source,
    name: event.name,
    network: event.network,
    chainId: event.chainId,
  });
  console.log(event.args);
});
