import { onchainTable } from "@ponder/core";

export const example = onchainTable("example", (t) => ({
  id: t.text().primaryKey(),
  name: t.text(),
}));

export const events = onchainTable("events", (t) => ({
  id: t.text().primaryKey(),
  chainId: t.integer(),
  network: t.text(),
  blockNumber: t.integer(),
  transactionHash: t.text(),
  eventName: t.text(),
  eventData: t.json(),
  timestamp: t.integer(),
}));

export const contracts = onchainTable("contracts", (t) => ({
  id: t.text().primaryKey(),
  chainId: t.integer(),
  network: t.text(),
  address: t.text(),
  deploymentBlock: t.integer(),
  lastIndexedBlock: t.integer(),
}));
