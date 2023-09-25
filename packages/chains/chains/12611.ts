import type { Chain } from "../src/types";
export default {
  "chainId": 12611,
  "chain": "ETH",
  "name": "Astar zkEVM",
  "rpc": [],
  "slug": "astar-zkevm",
  "icon": {
    "url": "ipfs://QmZm2RfbEfWjnqu7MLSG5ChhAsjnKqTvmHM5eJWvYGAwG8",
    "width": 800,
    "height": 264,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://astar.network",
  "shortName": "astrzk",
  "testnet": false,
  "status": "incubating",
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;