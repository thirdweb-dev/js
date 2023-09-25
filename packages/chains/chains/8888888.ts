import type { Chain } from "../src/types";
export default {
  "chainId": 8888888,
  "chain": "Quarix",
  "name": "Quarix",
  "rpc": [],
  "slug": "quarix",
  "icon": {
    "url": "ipfs://QmZmY6xVNzRAGwyT64PuyHaQ33BR84HEWvTVf6YHPW7kvQ",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Q",
    "symbol": "Q",
    "decimals": 18
  },
  "shortName": "quarix",
  "testnet": false,
  "status": "incubating",
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;