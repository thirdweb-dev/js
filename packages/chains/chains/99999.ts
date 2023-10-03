import type { Chain } from "../src/types";
export default {
  "chain": "USC",
  "chainId": 99999,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.ubchain.site/",
  "name": "UB Smart Chain",
  "nativeCurrency": {
    "name": "UBC",
    "symbol": "UBC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://ub-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.uschain.network"
  ],
  "shortName": "usc",
  "slug": "ub-smart-chain",
  "testnet": false
} as const satisfies Chain;