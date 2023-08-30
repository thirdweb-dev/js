import type { Chain } from "../src/types";
export default {
  "name": "Redbelly Network Testnet",
  "shortName": "rbn-testnet",
  "chain": "RBN",
  "chainId": 153,
  "networkId": 153,
  "rpc": [],
  "faucets": [],
  "infoURL": "https://redbelly.network",
  "nativeCurrency": {
    "name": "Redbelly Network Coin",
    "symbol": "RBNT",
    "decimals": 18
  },
  "status": "incubating",
  "testnet": true,
  "slug": "redbelly-network-testnet"
} as const satisfies Chain;