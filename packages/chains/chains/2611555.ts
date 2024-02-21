import type { Chain } from "../src/types";
export default {
  "chain": "DPU",
  "chainId": 2611555,
  "explorers": [],
  "faucets": [],
  "name": "DPU Chain",
  "nativeCurrency": {
    "name": "DGC",
    "symbol": "DGC",
    "decimals": 18
  },
  "networkId": 2611555,
  "rpc": [
    "https://2611555.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sc-rpc.dpu.ac.th"
  ],
  "shortName": "DPU",
  "slug": "dpu-chain",
  "testnet": false
} as const satisfies Chain;