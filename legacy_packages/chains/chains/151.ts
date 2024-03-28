import type { Chain } from "../src/types";
export default {
  "chain": "RBN",
  "chainId": 151,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://redbelly.network",
  "name": "Redbelly Network Mainnet",
  "nativeCurrency": {
    "name": "Redbelly Network Coin",
    "symbol": "RBNT",
    "decimals": 18
  },
  "networkId": 151,
  "rpc": [],
  "shortName": "rbn",
  "slug": "redbelly-network",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;