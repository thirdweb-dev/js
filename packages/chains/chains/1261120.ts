import type { Chain } from "../src/types";
export default {
  "name": "zKatana",
  "shortName": "azktn",
  "title": "Astar zkEVM Testnet zKatana",
  "chain": "ETH",
  "icon": {
    "url": "ipfs://QmZm2RfbEfWjnqu7MLSG5ChhAsjnKqTvmHM5eJWvYGAwG8",
    "width": 800,
    "height": 264,
    "format": "png"
  },
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://astar.network",
  "chainId": 1261120,
  "networkId": 1261120,
  "explorers": [],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": []
  },
  "status": "incubating",
  "testnet": true,
  "slug": "zkatana"
} as const satisfies Chain;