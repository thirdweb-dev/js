import type { Chain } from "../src/types";
export default {
  "name": "Redbelly Network Mainnet",
  "shortName": "rbn",
  "chain": "RBN",
  "chainId": 151,
  "networkId": 151,
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
  "slug": "redbelly-network"
} as const satisfies Chain;