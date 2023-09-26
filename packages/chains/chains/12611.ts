import type { Chain } from "../src/types";
export default {
  "name": "Astar zkEVM",
  "shortName": "astrzk",
  "title": "Astar zkEVM Mainnet",
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
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://astar.network",
  "chainId": 12611,
  "networkId": 12611,
  "explorers": [],
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": []
  },
  "status": "incubating",
  "testnet": false,
  "slug": "astar-zkevm"
} as const satisfies Chain;