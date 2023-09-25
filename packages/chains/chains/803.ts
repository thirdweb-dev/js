import type { Chain } from "../src/types";
export default {
  "chainId": 803,
  "chain": "Haic",
  "name": "Haic",
  "rpc": [
    "https://haic.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://orig.haichain.io/"
  ],
  "slug": "haic",
  "faucets": [],
  "nativeCurrency": {
    "name": "Haicoin",
    "symbol": "HAIC",
    "decimals": 18
  },
  "infoURL": "https://www.haichain.io/",
  "shortName": "haic",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;