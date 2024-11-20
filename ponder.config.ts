import { createConfig } from "@ponder/core";
import { http } from "viem";

import { TheCompactAbi } from "./abis/TheCompactAbi";

export default createConfig({
  networks: {
    mainnet: { chainId: 1, transport: http(process.env.PONDER_RPC_URL_1) },
  },
  contracts: {
    TheCompact: {
      abi: TheCompactAbi,
      address: "0x00000000000018DF021Ff2467dF97ff846E09f48",
      network: "mainnet",
      startBlock: 21124904,
    },
  },
});
