import type { Chain } from "../src/types";
export default {
  "chain": "RBN",
  "chainId": 153,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://redbelly.network",
  "name": "Redbelly Network Testnet",
  "nativeCurrency": {
    "name": "Redbelly Network Coin",
    "symbol": "RBNT",
    "decimals": 18
  },
  "networkId": 153,
  "rpc": [],
  "shortName": "rbn-testnet",
  "slug": "redbelly-network-testnet",
  "status": "incubating",
  "testnet": true
} as const satisfies Chain;