import { onchainTable, index, primaryKey, relations } from "@ponder/core";

export const account = onchainTable("account", (t) => ({
  address: t.hex().primaryKey(),
  first_seen_at: t.bigint().notNull(),
}));

export const allocator = onchainTable(
  "allocator",
  (t) => ({
    address: t.hex().primaryKey(),
    first_seen_at: t.bigint().notNull(),
  })
);

export const allocator_chain_id = onchainTable(
  "allocator_chain_id",
  (t) => ({
    allocator_address: t.hex().notNull(),
    allocator_id: t.bigint().notNull(),
    chain_id: t.bigint().notNull(),
    first_seen_at: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.allocator_address, table.allocator_id, table.chain_id] }),
    allocatorAddressIdx: index().on(table.allocator_address),
    chainIdIdx: index().on(table.chain_id),
  })
);

export const allocator_registration = onchainTable(
  "allocator_registration",
  (t) => ({
    allocator_address: t.hex().notNull(),
    chain_id: t.bigint().notNull(),
    registered_at: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.allocator_address, table.chain_id] }),
    allocatorAddressIdx: index().on(table.allocator_address),
    chainIdIdx: index().on(table.chain_id),
  })
);

export const deposited_token = onchainTable(
  "deposited_token",
  (t) => ({
    chain_id: t.bigint().notNull(),
    token_address: t.hex().notNull(),
    first_seen_at: t.bigint().notNull(),
    total_supply: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.token_address, table.chain_id] }),
    tokenAddressIdx: index().on(table.token_address),
    chainIdIdx: index().on(table.chain_id),
  })
);

export const resource_lock = onchainTable(
  "resource_lock",
  (t) => ({
    lock_id: t.bigint().notNull(),
    chain_id: t.bigint().notNull(),
    token_address: t.hex().notNull(),
    allocator_address: t.hex().notNull(),
    reset_period: t.bigint().notNull(),
    is_multichain: t.boolean().notNull(),
    minted_at: t.bigint().notNull(),
    total_supply: t.bigint().notNull(),
    withdrawal_status: t.integer().notNull().default(0),
    withdrawable_at: t.bigint().notNull().default(0n),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.lock_id, table.chain_id] }),
    lockIdIdx: index().on(table.lock_id),
    chainIdIdx: index().on(table.chain_id),
    tokenRegIdx: index().on(table.token_address, table.chain_id),
    allocRegIdx: index().on(table.allocator_address, table.chain_id),
  })
);

export const account_token_balance = onchainTable(
  "account_token_balance",
  (t) => ({
    account_address: t.hex().notNull(),
    token_address: t.hex().notNull(),
    chain_id: t.bigint().notNull(),
    balance: t.bigint().notNull(),
    last_updated_at: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({
      columns: [table.account_address, table.token_address, table.chain_id],
    }),
    accountIdx: index().on(table.account_address),
    tokenRegIdx: index().on(table.token_address, table.chain_id),
  })
);

export const account_resource_lock_balance = onchainTable(
  "account_resource_lock_balance",
  (t) => ({
    account_address: t.hex().notNull(),
    resource_lock: t.bigint().notNull(),
    chain_id: t.bigint().notNull(),
    token_address: t.hex().notNull(),
    balance: t.bigint().notNull(),
    withdrawal_status: t.integer().notNull().default(0),
    withdrawable_at: t.bigint().notNull().default(0n),
    last_updated_at: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({
      columns: [table.account_address, table.resource_lock, table.chain_id],
    }),
    accountIdx: index().on(table.account_address),
    resourceLockIdx: index().on(table.resource_lock, table.chain_id),
    tokenRegIdx: index().on(table.token_address, table.chain_id),
  })
);

export const claim = onchainTable(
  "claim",
  (t) => ({
    claim_hash: t.hex().notNull(),
    chain_id: t.bigint().notNull(),
    sponsor: t.hex().notNull(),
    allocator: t.hex().notNull(),
    arbiter: t.hex().notNull(),
    timestamp: t.bigint().notNull(),
    block_number: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.claim_hash, table.chain_id] }),
    claimHashIdx: index().on(table.claim_hash),
    chainIdIdx: index().on(table.chain_id),
    sponsorIdx: index().on(table.sponsor),
    allocatorIdx: index().on(table.allocator),
    allocatorChainIdx: index().on(table.allocator, table.chain_id),
  })
);

export const registered_compact = onchainTable(
  "registered_compact",
  (t) => ({
    claim_hash: t.hex().notNull(),
    chain_id: t.bigint().notNull(),
    sponsor: t.hex().notNull(),
    registered_at: t.bigint().notNull(),
    block_number: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.claim_hash, table.chain_id] }),
    claimHashIdx: index().on(table.claim_hash),
    chainIdIdx: index().on(table.chain_id),
    sponsorIdx: index().on(table.sponsor),
  })
);

export const accountRelations = relations(account, ({ many }) => ({
  claims: many(claim),
  registered_compacts: many(registered_compact),
  token_balances: many(account_token_balance),
  resource_locks: many(account_resource_lock_balance),
}));

export const allocatorRelations = relations(allocator, ({ many }) => ({
  supported_chains: many(allocator_chain_id),
  registrations: many(allocator_registration),
  claims: many(claim),
}));

export const allocatorChainIdRelations = relations(allocator_chain_id, ({ one }) => ({
  parent: one(allocator, {
    fields: [allocator_chain_id.allocator_address],
    references: [allocator.address],
  }),
}));

export const claimRelations = relations(claim, ({ one }) => ({
  sponsor: one(account, {
    fields: [claim.sponsor],
    references: [account.address],
  }),
  allocator: one(allocator, {
    fields: [claim.allocator],
    references: [allocator.address],
  }),
  allocator_chain_id: one(allocator_chain_id, {
    fields: [claim.allocator, claim.chain_id],
    references: [allocator_chain_id.allocator_address, allocator_chain_id.chain_id],
  }),
}));

export const allocatorRegistrationRelations = relations(allocator_registration, ({ one }) => ({
  allocator: one(allocator, {
    fields: [allocator_registration.allocator_address],
    references: [allocator.address],
  }),
}));

export const depositedTokenRelations = relations(deposited_token, ({ many }) => ({
  account_balances: many(account_token_balance),
  resource_locks: many(resource_lock),
}));

export const resourceLockRelations = relations(resource_lock, ({ one, many }) => ({
  token: one(deposited_token, {
    fields: [resource_lock.token_address, resource_lock.chain_id],
    references: [deposited_token.token_address, deposited_token.chain_id],
  }),
  allocator: one(allocator_registration, {
    fields: [resource_lock.allocator_address, resource_lock.chain_id],
    references: [allocator_registration.allocator_address, allocator_registration.chain_id],
  }),
  account_balances: many(account_resource_lock_balance),
}));

export const accountTokenBalanceRelations = relations(account_token_balance, ({ one, many }) => ({
  account: one(account, {
    fields: [account_token_balance.account_address],
    references: [account.address],
  }),
  token: one(deposited_token, {
    fields: [account_token_balance.token_address, account_token_balance.chain_id],
    references: [deposited_token.token_address, deposited_token.chain_id],
  }),
  resource_locks: many(account_resource_lock_balance),
}));

export const accountResourceLockBalanceRelations = relations(account_resource_lock_balance, ({ one }) => ({
  account: one(account, {
    fields: [account_resource_lock_balance.account_address],
    references: [account.address],
  }),
  resourceLock: one(resource_lock, {
    fields: [account_resource_lock_balance.resource_lock, account_resource_lock_balance.chain_id],
    references: [resource_lock.lock_id, resource_lock.chain_id],
  }),
  token_balance: one(account_token_balance, {
    fields: [account_resource_lock_balance.account_address, account_resource_lock_balance.token_address, account_resource_lock_balance.chain_id],
    references: [account_token_balance.account_address, account_token_balance.token_address, account_token_balance.chain_id],
  }),
}));

export const registeredCompactRelations = relations(registered_compact, ({ one }) => ({
  sponsor: one(account, {
    fields: [registered_compact.sponsor],
    references: [account.address],
  }),
  claim: one(claim, {
    fields: [registered_compact.claim_hash, registered_compact.chain_id],
    references: [claim.claim_hash, claim.chain_id],
  }),
}));

