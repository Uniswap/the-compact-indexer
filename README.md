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

A public instance of this indexer is available at [https://the-compact-indexer-2.ponder-dev.com/](https://the-compact-indexer-2.ponder-dev.com/).

## Installation

Create a `.env.local` file with RPC URLs for each network:
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
      address
      chains: supportedChains {
        items {
          allocatorId
          chainId
        }
      }
      claims(orderBy: "timestamp", orderDirection: "DESC") {
        items {
          chainId
          claimHash
          sponsor {
            address
          }
          arbiter
          blockNumber
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
      depositor: address  # account address
      tokenBalances(orderBy: "balance", orderDirection: "DESC") {
        items {
          token {
            chainId
            tokenAddress
            totalSupply
          }
          aggregate_balance: balance  # total balance for this token
          resourceLocks(orderBy: "balance", orderDirection: "DESC") {
            items {
              resourceLock {
                lockId
                allocator {
                  account: allocatorAddress
                }
                resetPeriod
                isMultichain
                totalSupply
              }
              balance  # balance for this specific resource lock
            }
          }
        }
      }
      claims(orderBy: "timestamp", orderDirection: "DESC") {
        items {
          chainId
          claimHash
          allocator {
            address
          }
          arbiter
          blockNumber
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
  resourceLock(lockId: "2178...7024", chainId: "1") {  # Format: lockId-chainId
    lockId
    chainId
    token {
      address: tokenAddress
    }
    allocator {
      address: allocatorAddress
    }
    accountBalances {
      totalCount
      items {
        account {
          address
        }
        balance
      }
    }
    resetPeriod
    isMultichain
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
      address
      resourceLocks {
        items {
          resourceLock {
            lockId
            chainId
            token {
              address: tokenAddress
            }
          }
          withdrawableAt
          withdrawalStatus
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
> Note: This query has not been tested as there is not yet relevant data to index.

```graphql
query {
  registeredCompacts {
    items {
      claimHash
      chainId
      sponsor {
        address
      }
      registeredAt
      blockNumber
      claim {  # Will be null if claim hasn't been processed yet
        allocator {
          address
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

#### Get an account's registered compacts and their claim status
> Note: This query has not been tested as there is not yet relevant data to index.

```graphql
query {
  account(address: "0x1234...") {
    registeredCompacts(orderBy: "registeredAt", orderDirection: "DESC") {
      items {
        claimHash
        chainId
        registeredAt
        claim {  # Will be null if claim hasn't been processed yet
          allocator {
            address
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
