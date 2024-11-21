import { onchainTable, relations, index, primaryKey } from "@ponder/core";

export const allocator = onchainTable(
  "allocator",
  (t) => ({
    id: t.text().notNull(), // allocator address
    allocator_id: t.text().notNull(),
    first_seen_at: t.bigint().notNull(),
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
    chain_id: t.bigint().notNull(),
    registered_at: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    allocatorAddressIdx: index().on(table.allocator_address),
    chainIdIdx: index().on(table.chain_id),
  })
);

export const token_registration = onchainTable(
  "token_registration",
  (t) => ({
    id: t.text().notNull(), // composite key: tokenAddress-chainId
    chain_id: t.bigint().notNull(),
    token_address: t.text().notNull(),
    first_seen_at: t.bigint().notNull(),
    total_supply: t.bigint().notNull(), // Total supply across all resource locks
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    tokenAddressIdx: index().on(table.token_address),
    chainIdIdx: index().on(table.chain_id),
  })
);

export const resource_lock = onchainTable(
  "resource_lock",
  (t) => ({
    id: t.text().notNull(), // token ID
    token_registration_id: t.text().notNull(), // reference to token_registration
    allocator_registration_id: t.text().notNull(), // reference to allocator_registration
    reset_period: t.bigint().notNull(), // bits 252-254: one of eight fixed values
    is_multichain: t.boolean().notNull(), // bit 255: scope (true = multichain)
    minted_at: t.bigint().notNull(),
    total_supply: t.bigint().notNull(), // Total supply for this specific resource lock
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    tokenRegIdx: index().on(table.token_registration_id),
    allocRegIdx: index().on(table.allocator_registration_id),
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

export const tokenRegistrationRelations = relations(token_registration, ({ many }) => ({
  locks: many(resource_lock),
}));

export const resourceLockRelations = relations(resource_lock, ({ one }) => ({
  token: one(token_registration, {
    fields: [resource_lock.token_registration_id],
    references: [token_registration.id],
  }),
  allocator: one(allocator_registration, {
    fields: [resource_lock.allocator_registration_id],
    references: [allocator_registration.id],
  }),
}));
