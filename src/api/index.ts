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
    .from(schema.resource_lock)
    .where(
      and(
        eq(schema.resource_lock.chain_id, chainId),
        eq(schema.resource_lock.lock_id, lockId)
      )
    )
    .innerJoin(
      schema.account_resource_lock_balance,
      and(
        eq(
          schema.resource_lock.lock_id,
          schema.account_resource_lock_balance.resource_lock
        ),
        eq(
          schema.resource_lock.chain_id,
          schema.account_resource_lock_balance.chain_id
        )
      )
    );

  if (result.length === 0) return c.text("Not found", 500);
  return c.json(replaceBigInts(result, (b) => formatEther(b)));
});
