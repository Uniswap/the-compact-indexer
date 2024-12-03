import { ponder } from "@/generated";
import * as schema from "../../ponder.schema";
import {
  and,
  eq,
  graphql,
  gt,
  inArray,
  lt,
  or,
  replaceBigInts,
  sum,
} from "@ponder/core";
import { getAddress } from "viem";

ponder.use("/", graphql());
ponder.use("/graphql", graphql());

ponder.post("/lock-balances/:address", async (c) => {
  const address = getAddress(c.req.param("address"));

  const body: {
    chainId: string;
    resourceLocks: string[];
    finalizedBlockNumber: string | undefined;
    finalizedBlockTimestamp: string | undefined;
  }[] = await c.req.json();

  const conditions: Parameters<typeof and>[0][] = [];

  for (const {
    chainId,
    resourceLocks,
    finalizedBlockNumber,
    finalizedBlockTimestamp,
  } of body) {
    const lockCondition = [
      eq(schema.accountDelta.address, address),
      inArray(schema.accountDelta.resourceLock, resourceLocks.map(BigInt)),
      eq(schema.accountDelta.chainId, BigInt(chainId)),
    ];

    const creditCondition = and(
      ...lockCondition,
      gt(schema.accountDelta.delta, 0n),
      finalizedBlockNumber === undefined
        ? undefined
        : gt(schema.accountDelta.blockNumber, BigInt(finalizedBlockNumber)),
      finalizedBlockTimestamp === undefined
        ? undefined
        : gt(
            schema.accountDelta.blockTimestamp,
            BigInt(finalizedBlockTimestamp)
          )
    );

    const debitCondition = and(
      ...lockCondition,
      lt(schema.accountDelta.delta, 0n)
    );

    conditions.push(or(creditCondition, debitCondition));
  }

  const result = await c.db
    .select({
      lockId: schema.accountDelta.resourceLock,
      chainId: schema.accountDelta.chainId,
      balance: sum(schema.accountDelta.delta),
      withdrawalStatus: schema.accountResourceLockBalance.withdrawalStatus,
    })
    .from(schema.accountDelta)
    .innerJoin(
      schema.accountResourceLockBalance,
      and(
        eq(
          schema.accountDelta.address,
          schema.accountResourceLockBalance.accountAddress
        ),
        eq(
          schema.accountDelta.chainId,
          schema.accountResourceLockBalance.chainId
        ),
        eq(
          schema.accountDelta.resourceLock,
          schema.accountResourceLockBalance.resourceLock
        )
      )
    )
    .where(or(...conditions))
    .groupBy(schema.accountDelta.resourceLock, schema.accountDelta.chainId);

  return c.json(replaceBigInts(result, (b) => b.toString()));
});
