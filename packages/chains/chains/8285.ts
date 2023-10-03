import type { Chain } from "../src/types";
export default {
  "chain": "Kortho",
  "chainId": 8285,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.kortho.io/",
  "name": "KorthoTest",
  "nativeCurrency": {
    "name": "Kortho Test",
    "symbol": "KTO",
    "decimals": 11
  },
  "redFlags": [],
  "rpc": [
    "https://korthotest.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://www.krotho-test.net"
  ],
  "shortName": "Kortho",
  "slug": "korthotest",
  "testnet": true
} as const satisfies Chain;