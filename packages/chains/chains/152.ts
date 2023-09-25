import type { Chain } from "../src/types";
export default {
  "chainId": 152,
  "chain": "RBN",
  "name": "Redbelly Network Devnet",
  "rpc": [],
  "slug": "redbelly-network-devnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Redbelly Network Coin",
    "symbol": "RBNT",
    "decimals": 18
  },
  "infoURL": "https://redbelly.network",
  "shortName": "rbn-devnet",
  "testnet": false,
  "status": "incubating",
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;