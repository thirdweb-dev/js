import type { Chain } from "../src/types";
export default {
  "chainId": 8888881,
  "chain": "Quarix",
  "name": "Quarix Testnet",
  "rpc": [],
  "slug": "quarix-testnet",
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
  "infoURL": "",
  "shortName": "quarix-testnet",
  "testnet": true,
  "status": "incubating",
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;