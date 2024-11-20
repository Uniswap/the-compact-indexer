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

## Development

```bash
# Install dependencies
pnpm install

# Start the indexer
pnpm ponder dev
```

## Usage

Once the indexer is running, you can query the GraphQL API at `http://localhost:42069`. Here's an example query to get all allocators and their registrations across different networks:

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

## Environment Variables

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
