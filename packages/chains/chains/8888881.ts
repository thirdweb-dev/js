import type { Chain } from "../src/types";
export default {
  "chain": "Quarix",
  "chainId": 8888881,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmZmY6xVNzRAGwyT64PuyHaQ33BR84HEWvTVf6YHPW7kvQ",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "name": "Quarix Testnet",
  "nativeCurrency": {
    "name": "Q",
    "symbol": "Q",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [],
  "shortName": "quarix-testnet",
  "slug": "quarix-testnet",
  "status": "incubating",
  "testnet": true
} as const satisfies Chain;