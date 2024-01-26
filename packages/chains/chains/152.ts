import type { Chain } from "../src/types";
export default {
  "chain": "RBN",
  "chainId": 152,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://redbelly.network",
  "name": "Redbelly Network Devnet",
  "nativeCurrency": {
    "name": "Redbelly Network Coin",
    "symbol": "RBNT",
    "decimals": 18
  },
  "networkId": 152,
  "rpc": [],
  "shortName": "rbn-devnet",
  "slug": "redbelly-network-devnet",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;