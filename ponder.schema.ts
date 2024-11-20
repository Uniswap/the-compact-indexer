import { onchainTable, relations, index, primaryKey } from "@ponder/core";

export const allocator = onchainTable(
  "allocator",
  (t) => ({
    id: t.text().notNull(), // allocator address
    allocator_id: t.text().notNull(),
    first_seen_at: t.integer().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    idIdx: index().on(table.id),
  })
);

export const allocator_registration = onchainTable(
  "allocator_registration",
  (t) => ({
    id: t.text().notNull(), // composite key: allocatorAddress-chainId
    allocator_address: t.text().notNull(),
    chain_id: t.integer().notNull(),
    registered_at: t.integer().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    allocatorAddressIdx: index().on(table.allocator_address),
    chainIdIdx: index().on(table.chain_id),
  })
);

// Define relationships
export const allocatorRelations = relations(allocator, ({ many }) => ({
  registrations: many(allocator_registration),
}));

export const registrationRelations = relations(allocator_registration, ({ one }) => ({
  allocator: one(allocator, {
    fields: [allocator_registration.allocator_address],
    references: [allocator.id],
  }),
}));

export const event = onchainTable(
  "event",
  (t) => ({
    id: t.text().notNull(),
    chain_id: t.integer().notNull(),
    network: t.text().notNull(),
    block_number: t.integer().notNull(),
    transaction_hash: t.text().notNull(),
    event_name: t.text().notNull(),
    event_data: t.json(),
    timestamp: t.integer().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    chainIdIdx: index().on(table.chain_id),
    blockNumberIdx: index().on(table.block_number),
  })
);

export const contract = onchainTable(
  "contract",
  (t) => ({
    id: t.text().notNull(),
    chain_id: t.integer().notNull(),
    network: t.text().notNull(),
    address: t.text().notNull(),
    deployment_block: t.integer().notNull(),
    last_indexed_block: t.integer().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    chainIdIdx: index().on(table.chain_id),
    addressIdx: index().on(table.address),
  })
);
