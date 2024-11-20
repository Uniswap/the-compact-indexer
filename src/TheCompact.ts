import { ponder } from "@/generated";

ponder.on("TheCompact:AllocatorRegistered", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("TheCompact:Approval", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("TheCompact:Claim", async ({ event, context }) => {
  console.log(event.args);
});

ponder.on("TheCompact:CompactRegistered", async ({ event, context }) => {
  console.log(event.args);
});
