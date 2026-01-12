import { Hono } from "hono";
import schema from "ponder:schema";
import { db } from "ponder:api";
import { and, eq, desc, graphql, replaceBigInts } from "ponder";
import { formatEther } from "viem";

const app = new Hono();

app.use("/", graphql({ db, schema }));
app.use("/graphql", graphql({ db, schema }));

// ============================================================================
// BLOCK TRACKING ENDPOINTS - For cross-indexer consistency checks
// ============================================================================

/**
 * Get the latest indexed block for a chain
 * Returns the most recently indexed block number, hash, and timestamp
 */
app.get("/blocks/:chainId/latest", async (c) => {
  const chainId = BigInt(c.req.param("chainId"));

  const result = await db
    .select()
    .from(schema.indexedBlock)
    .where(eq(schema.indexedBlock.chainId, chainId))
    .orderBy(desc(schema.indexedBlock.blockNumber))
    .limit(1);

  if (result.length === 0) {
    return c.json({ error: "No blocks found for chain" }, 404);
  }

  return c.json(replaceBigInts(result[0], (b) => b.toString()));
});

/**
 * Get a specific block by chain and block number
 */
app.get("/blocks/:chainId/:blockNumber", async (c) => {
  const chainId = BigInt(c.req.param("chainId"));
  const blockNumber = BigInt(c.req.param("blockNumber"));

  const result = await db
    .select()
    .from(schema.indexedBlock)
    .where(
      and(
        eq(schema.indexedBlock.chainId, chainId),
        eq(schema.indexedBlock.blockNumber, blockNumber)
      )
    )
    .limit(1);

  if (result.length === 0) {
    return c.json({ error: "Block not found" }, 404);
  }

  return c.json(replaceBigInts(result[0], (b) => b.toString()));
});

/**
 * Get a block by hash
 */
app.get("/blocks/hash/:blockHash", async (c) => {
  const blockHash = c.req.param("blockHash") as `0x${string}`;

  const result = await db
    .select()
    .from(schema.indexedBlock)
    .where(eq(schema.indexedBlock.blockHash, blockHash))
    .limit(1);

  if (result.length === 0) {
    return c.json({ error: "Block not found" }, 404);
  }

  return c.json(replaceBigInts(result[0], (b) => b.toString()));
});

/**
 * Get all indexed blocks for a chain (within 24-hour retention window)
 * Supports pagination with limit and offset
 */
app.get("/blocks/:chainId", async (c) => {
  const chainId = BigInt(c.req.param("chainId"));
  const limit = parseInt(c.req.query("limit") || "100");
  const offset = parseInt(c.req.query("offset") || "0");

  const result = await db
    .select()
    .from(schema.indexedBlock)
    .where(eq(schema.indexedBlock.chainId, chainId))
    .orderBy(desc(schema.indexedBlock.blockNumber))
    .limit(Math.min(limit, 1000))
    .offset(offset);

  return c.json({
    blocks: replaceBigInts(result, (b) => b.toString()),
    count: result.length,
    limit,
    offset,
  });
});

/**
 * Get latest blocks for all chains
 * Returns the most recent block for each indexed chain
 */
app.get("/blocks", async (c) => {
  // Get all unique chain IDs
  const allBlocks = await db
    .select()
    .from(schema.indexedBlock)
    .orderBy(desc(schema.indexedBlock.blockNumber));

  // Group by chainId and get the latest for each
  const latestByChain = new Map<string, typeof allBlocks[0]>();
  for (const block of allBlocks) {
    const chainKey = block.chainId.toString();
    if (!latestByChain.has(chainKey)) {
      latestByChain.set(chainKey, block);
    }
  }

  const result = Array.from(latestByChain.values());
  return c.json({
    chains: replaceBigInts(result, (b) => b.toString()),
  });
});

// ============================================================================
// RESOURCE LOCK ENDPOINTS
// ============================================================================

app.get("/resource-locks/:chainId/:lockId", async (c) => {
  const chainId = BigInt(c.req.param("chainId"));
  const lockId = BigInt(c.req.param("lockId"));

  const result = await db
    .select()
    .from(schema.resourceLock)
    .where(
      and(
        eq(schema.resourceLock.chainId, chainId),
        eq(schema.resourceLock.lockId, lockId)
      )
    )
    .innerJoin(
      schema.accountResourceLockBalance,
      and(
        eq(
          schema.resourceLock.lockId,
          schema.accountResourceLockBalance.resourceLock
        ),
        eq(
          schema.resourceLock.chainId,
          schema.accountResourceLockBalance.chainId
        )
      )
    );

  if (result.length === 0) return c.text("Not found", 500);
  return c.json(replaceBigInts(result, (b) => formatEther(b)));
});

export default app;
