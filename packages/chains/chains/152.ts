import type { Chain } from "../src/types";
export default {
  "name": "Redbelly Network Devnet",
  "shortName": "rbn-devnet",
  "chain": "RBN",
  "chainId": 152,
  "networkId": 152,
  "rpc": [],
  "faucets": [],
  "infoURL": "https://redbelly.network",
  "nativeCurrency": {
    "name": "Redbelly Network Coin",
    "symbol": "RBNT",
    "decimals": 18
  },
  "status": "incubating",
  "testnet": false,
  "slug": "redbelly-network-devnet"
} as const satisfies Chain;