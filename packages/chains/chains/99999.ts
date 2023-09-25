import type { Chain } from "../src/types";
export default {
  "chainId": 99999,
  "chain": "USC",
  "name": "UB Smart Chain",
  "rpc": [
    "https://ub-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.uschain.network"
  ],
  "slug": "ub-smart-chain",
  "faucets": [],
  "nativeCurrency": {
    "name": "UBC",
    "symbol": "UBC",
    "decimals": 18
  },
  "infoURL": "https://www.ubchain.site/",
  "shortName": "usc",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;