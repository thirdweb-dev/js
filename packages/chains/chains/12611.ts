import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 12611,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmZm2RfbEfWjnqu7MLSG5ChhAsjnKqTvmHM5eJWvYGAwG8",
    "width": 800,
    "height": 264,
    "format": "png"
  },
  "infoURL": "https://astar.network",
  "name": "Astar zkEVM",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [],
  "shortName": "astrzk",
  "slug": "astar-zkevm",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;