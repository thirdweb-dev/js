import type { Chain } from "../src/types";
export default {
  "name": "Quarix Testnet",
  "chain": "Quarix",
  "status": "incubating",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Q",
    "symbol": "Q",
    "decimals": 18
  },
  "infoURL": "",
  "shortName": "quarix-testnet",
  "chainId": 8888881,
  "networkId": 8888881,
  "icon": {
    "url": "ipfs://QmZmY6xVNzRAGwyT64PuyHaQ33BR84HEWvTVf6YHPW7kvQ",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "explorers": [],
  "testnet": true,
  "slug": "quarix-testnet"
} as const satisfies Chain;