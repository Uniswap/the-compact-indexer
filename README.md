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

# Start the indexer
pnpm ponder dev
```

## Usage

Once the indexer is running, you can query the GraphQL API at `http://localhost:42069`. Here are a few example queries:

#### Get all registered allocators across indexed networks
```graphql
query {
  allocators {
    totalCount
    items {
      id
      allocator_id
      first_seen_at
      registrations {
        totalCount
        items {
          id
          chain_id
          registered_at
        }
      }
    }
  }
}
```

This query returns:
- All registered allocators
- Their unique IDs and first seen timestamps
- All networks where each allocator is registered
- Registration timestamps for each network

#### Get account balances across tokens and their respective resource locks

```graphql
query {
  accounts {
    items {
      depositor: id  # account address
      token_balances {
        items {
          token {
            chain_id
            token_address
            total_supply
          }
          aggregate_balance: balance  # total balance for this token
          resource_locks {
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

#### Get all accounts holding a specific resource lock
```graphql
query {
  resource_lock(id: "217-1") {  # Format: lock_id-chainId
    id
    lock_id     # original ERC-6909 ID
    chain_id
    token {
      token_address
      chain_id
    }
    allocator {
      allocator_address
    }
    reset_period
    is_multichain
    total_supply
    account_balances {
      items {
        account {
          id  # account address
        }
        balance
      }
    }
  }
}
```

This query returns:
- Lock details (ID, original lock ID, chain ID, token, allocator, reset period, scope)
- Lock-specific total supply
- All accounts holding a balance in the lock

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
              token_address
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
