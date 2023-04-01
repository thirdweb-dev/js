import type { Chain } from "../src/types";
export default {
  "name": "KorthoTest",
  "chain": "Kortho",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Kortho Test",
    "symbol": "KTO",
    "decimals": 11
  },
  "infoURL": "https://www.kortho.io/",
  "shortName": "Kortho",
  "chainId": 8285,
  "networkId": 8285,
  "testnet": true,
  "slug": "korthotest"
} as const satisfies Chain;