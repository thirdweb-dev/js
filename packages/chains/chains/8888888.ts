import type { Chain } from "../src/types";
export default {
  "name": "Quarix",
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
  "shortName": "quarix",
  "chainId": 8888888,
  "networkId": 8888888,
  "icon": {
    "url": "ipfs://QmZmY6xVNzRAGwyT64PuyHaQ33BR84HEWvTVf6YHPW7kvQ",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "explorers": [],
  "testnet": false,
  "slug": "quarix"
} as const satisfies Chain;