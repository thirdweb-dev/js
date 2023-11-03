import type { Chain } from "../types";
export default {
  "chain": "Haic",
  "chainId": 803,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://www.haichain.io/",
  "name": "Haic",
  "nativeCurrency": {
    "name": "Haicoin",
    "symbol": "HAIC",
    "decimals": 18
  },
  "networkId": 803,
  "rpc": [
    "https://haic.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://803.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://orig.haichain.io/"
  ],
  "shortName": "haic",
  "slug": "haic",
  "testnet": false
} as const satisfies Chain;