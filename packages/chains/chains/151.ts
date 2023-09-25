import type { Chain } from "../src/types";
export default {
  "chainId": 151,
  "chain": "RBN",
  "name": "Redbelly Network Mainnet",
  "rpc": [],
  "slug": "redbelly-network",
  "faucets": [],
  "nativeCurrency": {
    "name": "Redbelly Network Coin",
    "symbol": "RBNT",
    "decimals": 18
  },
  "infoURL": "https://redbelly.network",
  "shortName": "rbn",
  "testnet": false,
  "status": "incubating",
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;