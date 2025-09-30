import { createConfig } from "ponder";
import { http } from "viem";

import { TheCompactAbi } from "./abis/TheCompactAbi";

export default createConfig({
  ordering: "multichain",
  networks: {
    mainnet: { chainId: 1, transport: http(process.env.PONDER_RPC_URL_1) },
    sepolia: { chainId: 11155111, transport: http(process.env.PONDER_RPC_URL_11155111) },
    base: { chainId: 8453, transport: http(process.env.PONDER_RPC_URL_8453) },
    baseSepolia: { chainId: 84532, transport: http(process.env.PONDER_RPC_URL_84532) },
    optimism: { chainId: 10, transport: http(process.env.PONDER_RPC_URL_10) },
    optimismSepolia: { chainId: 11155420, transport: http(process.env.PONDER_RPC_URL_11155420) },
    unichain: { chainId: 130, transport: http(process.env.PONDER_RPC_URL_130) },
    unichainSepolia: { chainId: 1301, transport: http(process.env.PONDER_RPC_URL_1301) },
  },
  contracts: {
    TheCompact: {
      abi: TheCompactAbi,
      address: "0x00000000000000171ede64904551eeDF3C6C9788",
      network: {
        mainnet: { startBlock: 23369559 },
        sepolia: { startBlock: 9276490 },
        base: { startBlock: 35587737 },
        baseSepolia: { startBlock: 31515296 },
        optimism: { startBlock: 141633918 },
        optimismSepolia: { startBlock: 33498177 },
        unichain: { startBlock: 27205887 },
        unichainSepolia: { startBlock: 32397235 },
      },
    },
  },
});
