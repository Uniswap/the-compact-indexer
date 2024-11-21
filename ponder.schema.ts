import { onchainTable, relations, index, primaryKey } from "@ponder/core";

export const account = onchainTable(
  "account",
  (t) => ({
    id: t.text().notNull(),
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
    first_seen_at: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
  })
);

export const allocator_chain_id = onchainTable(
  "allocator_chain_id",
  (t) => ({
    id: t.text().notNull(),
    allocator_address: t.text().notNull(),
    chain_id: t.bigint().notNull(),
    allocator_id: t.bigint().notNull(),
    first_seen_at: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    allocatorIdx: index().on(table.allocator_address),
    chainIdIdx: index().on(table.chain_id),
    allocatorChainIdx: index().on(table.allocator_address, table.chain_id),
  })
);

export const allocator_registration = onchainTable(
  "allocator_registration",
  (t) => ({
    id: t.text().notNull(),
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

export const deposited_token = onchainTable(
  "deposited_token",
  (t) => ({
    id: t.text().notNull(),
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
    id: t.text().notNull(),
    lock_id: t.text().notNull(),
    chain_id: t.bigint().notNull(),
    token_registration_id: t.text().notNull(),
    allocator_registration_id: t.text().notNull(),
    reset_period: t.bigint().notNull(),
    is_multichain: t.boolean().notNull(),
    minted_at: t.bigint().notNull(),
    total_supply: t.bigint().notNull(),
    withdrawal_status: t.integer().notNull().default(0),
    withdrawable_at: t.bigint().notNull().default(0n),
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
    id: t.text().notNull(),
    account_id: t.text().notNull(),
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
    id: t.text().notNull(),
    account_id: t.text().notNull(),
    resource_lock_id: t.text().notNull(),
    token_registration_id: t.text().notNull(),
    balance: t.bigint().notNull(),
    withdrawal_status: t.integer().notNull().default(0),
    withdrawable_at: t.bigint().notNull().default(0n),
    last_updated_at: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    accountIdx: index().on(table.account_id),
    resourceLockIdx: index().on(table.resource_lock_id),
    tokenRegIdx: index().on(table.token_registration_id),
    withdrawalStatusIdx: index().on(table.withdrawal_status),
  })
);

export const claim = onchainTable(
  "claim",
  (t) => ({
    id: t.text().notNull(),
    claim_hash: t.text().notNull(),
    chain_id: t.bigint().notNull(),
    sponsor_id: t.text().notNull(),
    allocator_address: t.text().notNull(),
    arbiter: t.text().notNull(),
    timestamp: t.bigint().notNull(),
    block_number: t.bigint().notNull(),
    allocator_id: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    claimHashIdx: index().on(table.claim_hash),
    chainIdIdx: index().on(table.chain_id),
    sponsorIdx: index().on(table.sponsor_id),
    allocatorIdx: index().on(table.allocator_address),
    allocatorChainIdx: index().on(table.allocator_address, table.chain_id),
  })
);

export const allocatorChainIdRelations = relations(allocator_chain_id, ({ one }) => ({
  parent: one(allocator, {
    fields: [allocator_chain_id.allocator_address],
    references: [allocator.id],
  }),
}));

export const claimRelations = relations(claim, ({ one }) => ({
  sponsor: one(account, {
    fields: [claim.sponsor_id],
    references: [account.id],
  }),
  allocator: one(allocator, {
    fields: [claim.allocator_address],
    references: [allocator.id],
  }),
  allocator_chain_id: one(allocator_chain_id, {
    fields: [claim.allocator_address, claim.chain_id],
    references: [allocator_chain_id.allocator_address, allocator_chain_id.chain_id],
  }),
}));

export const allocatorRelations = relations(allocator, ({ many }) => ({
  registrations: many(allocator_registration, {
    fields: [allocator.id],
    references: [allocator_registration.allocator_address],
  }),
  supported_chains: many(allocator_chain_id, {
    fields: [allocator.id],
    references: [allocator_chain_id.allocator_address],
  }),
  claims: many(claim, {
    fields: [allocator.id],
    references: [claim.allocator_address],
  }),
}));

export const allocatorRegistrationRelations = relations(allocator_registration, ({ one }) => ({
  allocator: one(allocator, {
    fields: [allocator_registration.allocator_address],
    references: [allocator.id],
  }),
}));

export const accountRelations = relations(account, ({ many }) => ({
  claims: many(claim, {
    fields: [account.id],
    references: [claim.sponsor_id],
  }),
  token_balances: many(account_token_balance, {
    fields: [account.id],
    references: [account_token_balance.account_id],
  }),
  resource_locks: many(account_resource_lock_balance, {
    fields: [account.id],
    references: [account_resource_lock_balance.account_id],
  }),
}));

export const depositedTokenRelations = relations(deposited_token, ({ many }) => ({
  account_balances: many(account_token_balance, {
    fields: [deposited_token.id],
    references: [account_token_balance.token_registration_id],
  }),
  resource_locks: many(resource_lock, {
    fields: [deposited_token.id],
    references: [resource_lock.token_registration_id],
  }),
}));

export const resourceLockRelations = relations(resource_lock, ({ one, many }) => ({
  token: one(deposited_token, {
    fields: [resource_lock.token_registration_id],
    references: [deposited_token.id],
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
  token: one(deposited_token, {
    fields: [account_token_balance.token_registration_id],
    references: [deposited_token.id],
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

export const resolvers = {
  allocator_chain_id: {
    allocator_id: (chainId: any) => chainId.allocator_id,
  },
  claim: {
    allocator_id: (claim: any) => claim.allocator_id,
  },
};
