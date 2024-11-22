# The Compact Indexer

An indexer for [The Compact](https://github.com/Uniswap/the-compact) built with [Ponder](https://github.com/ponder-sh/ponder).

## Overview

This indexer tracks events from The Compact contract across multiple networks:
- Mainnet
- Sepolia
- Base
- Base Sepolia
- Optimism
- Optimism Sepolia
- Unichain Sepolia

## Events Tracked

- Contract-specific events:
  - AllocatorRegistered
  - Claim
  - CompactRegistered
  - ForcedWithdrawalStatusUpdated

- ERC6909 events:
  - Transfer
  - OperatorSet
  - Approval

## Installation

Create a `.env` file with RPC URLs for each network:
```bash
PONDER_RPC_URL_1=           # Mainnet
PONDER_RPC_URL_11155111=    # Sepolia
PONDER_RPC_URL_8453=        # Base
PONDER_RPC_URL_84532=       # Base Sepolia
PONDER_RPC_URL_10=          # Optimism
PONDER_RPC_URL_11155420=    # Optimism Sepolia
PONDER_RPC_URL_1301=        # Unichain Sepolia
```

Next, install dependencies and run the indexer:
```bash
# Install dependencies
pnpm install

# Run codegen
pnpm ponder codegen

# Start the indexer
pnpm dev
```

## Usage

Once the indexer is running, you can query the GraphQL API at `http://localhost:42069`. Here are a few example queries:

#### Get all registered allocators across indexed networks
```graphql
query {
  allocators {
    items {
      address: id
      chains: supported_chains {
        items {
          allocator_id
          chain_id
        }
      }
      claims(orderBy: "timestamp", orderDirection: "DESC") {
        items {
          chain_id
          claim_hash
          sponsor {
            address: id
          }
          arbiter
          block_number
          timestamp
        }
      }
    }
  }
}
```

This query returns:
- All registered allocators
- Chains where each allocator is registered and their allocator ID on each chain
- Processed claims mediated by each allocator

#### Get account balances across tokens and their respective resource locks

```graphql
query {
  accounts {
    items {
      depositor: id  # account address
      token_balances(orderBy: "balance", orderDirection: "DESC") {
        items {
          token {
            chain_id
            token_address
            total_supply
          }
          aggregate_balance: balance  # total balance for this token
          resource_locks(orderBy: "balance", orderDirection: "DESC") {
            items {
              resourceLock {
                id
                allocator {
                  account: allocator_address
                }
                reset_period
                is_multichain
                total_supply
              }
              balance  # balance for this specific resource lock
            }
          }
        }
      }
      claims(orderBy: "timestamp", orderDirection: "DESC") {
        items {
          chain_id
          claim_hash
          allocator {
            address: id
          }
          arbiter
          block_number
          timestamp
        }
      }
    }
  }
}
```

This query returns:
- All accounts that have held a balance in a resource lock
- For each account:
  - All tokens they hold, with:
    - Token details (chain ID, address, total supply)
    - Aggregate balance across all resource locks
    - Individual resource locks, each with:
      - Lock details (ID, allocator, reset period, scope)
      - Lock-specific balance
      - Lock-specific total supply
  - Processed claims sponsored by the account

#### Get all accounts holding a specific resource lock
```graphql
query {
  resource_lock(id: "2178...7024-1") {  # Format: lock_id-chainId
    lock_id
    chain_id
    token {
      address: token_address
    }
    allocator {
      address: allocator_address
    }
    account_balances {
      totalCount
      items {
        account {
          id
        }
        balance
      }
    }
    reset_period
    is_multichain
  }
}
```

This query returns:
- Resource lock details
- Token address
- All accounts holding this resource lock
- Each account's balance

#### Get account resource locks directly with balances and token info
```graphql
query {
  accounts {
    items {
      id
      resource_locks {
        items {
          resourceLock {
            lock_id
            chain_id
            token {
              address: token_address
            }
            withdrawal_status
            withdrawable_at
          }
          balance  # Account's balance for this resource lock
        }
      }
    }
  }
}
```

This query demonstrates:
- Direct querying of resource locks for each account
- Access to lock details including withdrawal status
- Associated token information
- Account-specific balances for each resource lock

#### Get all registered compacts with their associated claims
```graphql
query {
  registered_compacts {
    items {
      claim_hash
      chain_id
      sponsor {
        address: id
      }
      registered_at
      block_number
      claim {  # Will be null if claim hasn't been processed yet
        allocator {
          address: id
        }
        arbiter
        timestamp
      }
    }
  }
}
```

This query returns:
- All registered compacts across networks
- Their claim hashes and registration details
- The sponsor's address
- Associated claim details (if the claim exists)

#### Get all claims and their registration status
```graphql
query {
  claims(orderBy: timestamp, orderDirection: DESC) {
    items {
      claim_hash
      chain_id
      sponsor {
        address: id
      }
      allocator {
        address: id
      }
      arbiter
      timestamp
      registered_compact {  # Will be null if compact hasn't been registered yet
        registered_at
        block_number
      }
    }
  }
}
```

This query returns:
- All processed claims, sorted by timestamp
- Complete claim details including sponsor, allocator, and arbiter
- Registration details if the claim has been registered as a compact

#### Get an account's registered compacts and their claim status
```graphql
query {
  account(id: "0x1234...") {
    registered_compacts(orderBy: registered_at, orderDirection: DESC) {
      items {
        claim_hash
        chain_id
        registered_at
        claim {  # Will be null if claim hasn't been processed yet
          allocator {
            address: id
          }
          arbiter
          timestamp
        }
      }
    }
  }
}
```

This query returns:
- All compacts registered by a specific account
- Registration timestamps
- Associated claim details when available
