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

export const deposited_token = onchainTable(
  "deposited_token",
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
    withdrawal_status: t.integer().notNull().default(0),
    withdrawable_at: t.bigint().notNull().default(0n),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    lockIdIdx: index().on(table.lock_id),
    chainIdIdx: index().on(table.chain_id),
    tokenRegIdx: index().on(table.token_registration_id),
    allocRegIdx: index().on(table.allocator_registration_id),
  }),
  (table) => ({
    token: many(deposited_token, {
      references: [{ columns: [table.token_registration_id], foreignColumns: [deposited_token.id] }],
    }),
    allocator: many(allocator_registration, {
      references: [{ columns: [table.allocator_registration_id], foreignColumns: [allocator_registration.id] }],
    }),
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
    withdrawal_status: t.integer().notNull().default(0), // Maps to ForcedWithdrawalStatus enum
    withdrawable_at: t.bigint().notNull().default(0n), // Only set when status is Pending
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

export enum ForcedWithdrawalStatus {
  Disabled = 0,
  Pending = 1,
  Enabled = 2,
}

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
  resource_lock: {
    withdrawal_status: async (resourceLock: any, _: any, context: any) => {
      const accountId = context.parent?.account?.id;
      if (!accountId) return 0;

      const balance = await context.db.find(account_resource_lock_balance, {
        id: `${accountId}-${resourceLock.id}`
      });
      return balance?.withdrawal_status ?? 0;
    },
    withdrawable_at: async (resourceLock: any, _: any, context: any) => {
      const accountId = context.parent?.account?.id;
      if (!accountId) return 0n;

      const balance = await context.db.find(account_resource_lock_balance, {
        id: `${accountId}-${resourceLock.id}`
      });
      return balance?.withdrawable_at ?? 0n;
    }
  }
};
