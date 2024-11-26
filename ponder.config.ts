import { createConfig } from "@ponder/core";
import { http } from "viem";

import { TheCompactAbi } from "./abis/TheCompactAbi";

export default createConfig({
  networks: {
    mainnet: { chainId: 1, transport: http(process.env.PONDER_RPC_URL_1) },
    sepolia: { chainId: 11155111, transport: http(process.env.PONDER_RPC_URL_11155111) },
    base: { chainId: 8453, transport: http(process.env.PONDER_RPC_URL_8453) },
    baseSepolia: { chainId: 84532, transport: http(process.env.PONDER_RPC_URL_84532) },
    optimism: { chainId: 10, transport: http(process.env.PONDER_RPC_URL_10) },
    optimismSepolia: { chainId: 11155420, transport: http(process.env.PONDER_RPC_URL_11155420) },
    unichainSepolia: { chainId: 1301, transport: http(process.env.PONDER_RPC_URL_1301) },
  },
  contracts: {
    TheCompact: {
      abi: TheCompactAbi,
      address: "0x00000000000018DF021Ff2467dF97ff846E09f48",
      network: {
        mainnet: { startBlock: 21124904 },
        sepolia: { startBlock: 7020093 },
        base: { startBlock: 22031390 },
        baseSepolia: { startBlock: 17541891 },
        optimism: { startBlock: 127708222 },
        optimismSepolia: { startBlock: 19606376 },
        unichainSepolia: { startBlock: 3999509 },
      },
    },
  },
});
