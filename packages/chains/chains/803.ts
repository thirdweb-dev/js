import type { Chain } from "../src/types";
export default {
  "name": "Haic",
  "chain": "Haic",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Haicoin",
    "symbol": "HAIC",
    "decimals": 18
  },
  "infoURL": "https://www.haichain.io/",
  "shortName": "haic",
  "chainId": 803,
  "networkId": 803,
  "testnet": false,
  "slug": "haic"
} as const satisfies Chain;