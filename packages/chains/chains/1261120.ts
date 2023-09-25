import type { Chain } from "../src/types";
export default {
  "chainId": 1261120,
  "chain": "ETH",
  "name": "zKatana",
  "rpc": [],
  "slug": "zkatana",
  "icon": {
    "url": "ipfs://QmZm2RfbEfWjnqu7MLSG5ChhAsjnKqTvmHM5eJWvYGAwG8",
    "width": 800,
    "height": 264,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://astar.network",
  "shortName": "azktn",
  "testnet": true,
  "status": "incubating",
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;