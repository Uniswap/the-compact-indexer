import { onchainTable, relations, index, primaryKey } from "@ponder/core";

export const account = onchainTable(
  "account",
  (t) => ({
    id: t.text().notNull(), // account_address
    first_seen_at: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
  })
);

export const allocator = onchainTable(
  "allocator",
  (t) => ({
    id: t.text().notNull(),
    allocator_id: t.text().notNull(),
    first_seen_at: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    idIdx: index().on(table.allocator_id),
  })
);

export const allocator_registration = onchainTable(
  "allocator_registration",
  (t) => ({
    id: t.text().notNull(), // allocator_address-chainId
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
    id: t.text().notNull(), // token_address-chainId
    chain_id: t.bigint().notNull(),
    token_address: t.text().notNull(),
    first_seen_at: t.bigint().notNull(),
    total_supply: t.bigint().notNull(),
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
    id: t.text().notNull(), // lock_id-chainId
    lock_id: t.text().notNull(), // original ERC-6909 ID
    chain_id: t.bigint().notNull(),
    token_registration_id: t.text().notNull(),
    allocator_registration_id: t.text().notNull(),
    reset_period: t.bigint().notNull(),
    is_multichain: t.boolean().notNull(),
    minted_at: t.bigint().notNull(),
    total_supply: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    lockIdIdx: index().on(table.lock_id),
    chainIdIdx: index().on(table.chain_id),
    tokenRegIdx: index().on(table.token_registration_id),
    allocRegIdx: index().on(table.allocator_registration_id),
  })
);

export const account_token_balance = onchainTable(
  "account_token_balance",
  (t) => ({
    id: t.text().notNull(), // account_address-token_registration_id
    account_id: t.text().notNull(), // account_address
    token_registration_id: t.text().notNull(),
    balance: t.bigint().notNull(),
    last_updated_at: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    accountIdx: index().on(table.account_id),
    tokenRegIdx: index().on(table.token_registration_id),
  })
);

export const account_resource_lock_balance = onchainTable(
  "account_resource_lock_balance",
  (t) => ({
    id: t.text().notNull(), // account_address-resource_lock_id
    account_id: t.text().notNull(), // account_address
    resource_lock_id: t.text().notNull(),
    token_registration_id: t.text().notNull(),
    balance: t.bigint().notNull(),
    last_updated_at: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    accountIdx: index().on(table.account_id),
    resourceLockIdx: index().on(table.resource_lock_id),
    tokenRegIdx: index().on(table.token_registration_id),
  })
);

export const accountRelations = relations(account, ({ many }) => ({
  token_balances: many(account_token_balance, {
    fields: [account.id],
    references: [account_token_balance.account_id],
  }),
}));

export const allocatorRegistrationRelations = relations(allocator_registration, ({ one }) => ({
  allocator: one(allocator, {
    fields: [allocator_registration.allocator_address],
    references: [allocator.allocator_id],
  }),
}));

export const tokenRegistrationRelations = relations(token_registration, ({ many }) => ({
  account_balances: many(account_token_balance, {
    fields: [token_registration.id],
    references: [account_token_balance.token_registration_id],
  }),
  resource_locks: many(resource_lock, {
    fields: [token_registration.id],
    references: [resource_lock.token_registration_id],
  }),
}));

export const resourceLockRelations = relations(resource_lock, ({ one, many }) => ({
  token: one(token_registration, {
    fields: [resource_lock.token_registration_id],
    references: [token_registration.id],
  }),
  allocator: one(allocator_registration, {
    fields: [resource_lock.allocator_registration_id],
    references: [allocator_registration.id],
  }),
  account_balances: many(account_resource_lock_balance, {
    fields: [resource_lock.id],
    references: [account_resource_lock_balance.resource_lock_id],
  }),
}));

export const accountTokenBalanceRelations = relations(account_token_balance, ({ one, many }) => ({
  account: one(account, {
    fields: [account_token_balance.account_id],
    references: [account.id],
  }),
  token: one(token_registration, {
    fields: [account_token_balance.token_registration_id],
    references: [token_registration.id],
  }),
  resource_locks: many(account_resource_lock_balance, {
    fields: [account_token_balance.account_id, account_token_balance.token_registration_id],
    references: [account_resource_lock_balance.account_id, account_resource_lock_balance.token_registration_id],
  }),
}));

export const accountResourceLockBalanceRelations = relations(account_resource_lock_balance, ({ one }) => ({
  account: one(account, {
    fields: [account_resource_lock_balance.account_id],
    references: [account.id],
  }),
  resourceLock: one(resource_lock, {
    fields: [account_resource_lock_balance.resource_lock_id],
    references: [resource_lock.id],
  }),
  token_balance: one(account_token_balance, {
    fields: [account_resource_lock_balance.account_id, account_resource_lock_balance.token_registration_id],
    references: [account_token_balance.account_id, account_token_balance.token_registration_id],
  }),
}));
