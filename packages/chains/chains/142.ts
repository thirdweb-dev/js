import type { Chain } from "../src/types";
export default {
  "name": "DAX CHAIN",
  "chain": "DAX",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Prodax",
    "symbol": "DAX",
    "decimals": 18
  },
  "infoURL": "https://prodax.io/",
  "shortName": "dax",
  "chainId": 142,
  "networkId": 142,
  "testnet": false,
  "slug": "dax-chain"
} as const satisfies Chain;