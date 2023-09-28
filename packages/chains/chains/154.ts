import type { Chain } from "../src/types";
export default {
  "name": "Redbelly Network TGE",
  "shortName": "rbn-tge",
  "chain": "RBN",
  "chainId": 154,
  "networkId": 154,
  "rpc": [],
  "faucets": [],
  "infoURL": "https://redbelly.network",
  "nativeCurrency": {
    "name": "Redbelly Network Coin",
    "symbol": "RBNT",
    "decimals": 18
  },
  "testnet": false,
  "slug": "redbelly-network-tge"
} as const satisfies Chain;