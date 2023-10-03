import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 1261120,
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
  "name": "zKatana",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [],
  "shortName": "azktn",
  "slug": "zkatana",
  "status": "incubating",
  "testnet": true
} as const satisfies Chain;