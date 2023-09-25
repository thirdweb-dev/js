import type { Chain } from "../src/types";
export default {
  "chainId": 8285,
  "chain": "Kortho",
  "name": "KorthoTest",
  "rpc": [
    "https://korthotest.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://www.krotho-test.net"
  ],
  "slug": "korthotest",
  "faucets": [],
  "nativeCurrency": {
    "name": "Kortho Test",
    "symbol": "KTO",
    "decimals": 11
  },
  "infoURL": "https://www.kortho.io/",
  "shortName": "Kortho",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;