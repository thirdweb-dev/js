import type { Chain } from "../src/types";
export default {
  "name": "UB Smart Chain",
  "chain": "USC",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "UBC",
    "symbol": "UBC",
    "decimals": 18
  },
  "infoURL": "https://www.ubchain.site/",
  "shortName": "usc",
  "chainId": 99999,
  "networkId": 99999,
  "testnet": false,
  "slug": "ub-smart-chain"
} as const satisfies Chain;