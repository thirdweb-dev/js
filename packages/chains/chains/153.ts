import type { Chain } from "../src/types";
export default {
  "chainId": 153,
  "chain": "RBN",
  "name": "Redbelly Network Testnet",
  "rpc": [],
  "slug": "redbelly-network-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Redbelly Network Coin",
    "symbol": "RBNT",
    "decimals": 18
  },
  "infoURL": "https://redbelly.network",
  "shortName": "rbn-testnet",
  "testnet": true,
  "status": "incubating",
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;