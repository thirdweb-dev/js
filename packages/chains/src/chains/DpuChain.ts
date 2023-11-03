import type { Chain } from "../types";
export default {
  "chain": "DPU",
  "chainId": 2611555,
  "explorers": [],
  "faucets": [],
  "name": "DPU Chain",
  "nativeCurrency": {
    "name": "DGS",
    "symbol": "DGS",
    "decimals": 18
  },
  "networkId": 2611555,
  "rpc": [
    "https://dpu-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2611555.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sc-rpc.dpu.ac.th"
  ],
  "shortName": "DPU",
  "slug": "dpu-chain",
  "testnet": false
} as const satisfies Chain;