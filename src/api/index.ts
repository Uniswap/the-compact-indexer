import { ponder } from "@/generated";
import * as schema from "../../ponder.schema";
import { and, eq, graphql, replaceBigInts } from "@ponder/core";
import { formatEther } from "viem";

ponder.use("/", graphql());
ponder.use("/graphql", graphql());

ponder.get("/resource-locks/:chainId/:lockId", async (c) => {
  const chainId = BigInt(c.req.param("chainId"));
  const lockId = BigInt(c.req.param("lockId"));

  const result = await c.db
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
