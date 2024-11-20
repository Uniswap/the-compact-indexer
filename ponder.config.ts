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
    TheCompactMainnet: {
      abi: TheCompactAbi,
      address: "0x00000000000018DF021Ff2467dF97ff846E09f48",
      network: "mainnet",
      startBlock: 21124904,
    },
    TheCompactSepolia: {
      abi: TheCompactAbi,
      address: "0x00000000000018DF021Ff2467dF97ff846E09f48",
      network: "sepolia",
      startBlock: 7020093,
    },
    TheCompactBase: {
      abi: TheCompactAbi,
      address: "0x00000000000018DF021Ff2467dF97ff846E09f48",
      network: "base",
      startBlock: 22031390,
    },
    TheCompactBaseSepolia: {
      abi: TheCompactAbi,
      address: "0x00000000000018DF021Ff2467dF97ff846E09f48",
      network: "baseSepolia",
      startBlock: 17541891,
    },
    TheCompactOptimism: {
      abi: TheCompactAbi,
      address: "0x00000000000018DF021Ff2467dF97ff846E09f48",
      network: "optimism",
      startBlock: 127708222,
    },
    TheCompactOptimismSepolia: {
      abi: TheCompactAbi,
      address: "0x00000000000018DF021Ff2467dF97ff846E09f48",
      network: "optimismSepolia",
      startBlock: 19606376,
    },
    TheCompactUnichainSepolia: {
      abi: TheCompactAbi,
      address: "0x00000000000018DF021Ff2467dF97ff846E09f48",
      network: "unichainSepolia",
      startBlock: 3999509,
    },
  },
});
