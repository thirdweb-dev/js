import type { Chain } from "../src/types";
export default {
  "chain": "Quarix",
  "chainId": 8888888,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmZmY6xVNzRAGwyT64PuyHaQ33BR84HEWvTVf6YHPW7kvQ",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "name": "Quarix",
  "nativeCurrency": {
    "name": "Q",
    "symbol": "Q",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [],
  "shortName": "quarix",
  "slug": "quarix",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;