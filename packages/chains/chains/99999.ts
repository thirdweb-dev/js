import type { Chain } from "../src/types";
export default {
  "chain": "USC",
  "chainId": 99999,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://www.ubchain.site/",
  "name": "UB Smart Chain",
  "nativeCurrency": {
    "name": "UBC",
    "symbol": "UBC",
    "decimals": 18
  },
  "networkId": 99999,
  "rpc": [
    "https://99999.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.uschain.network"
  ],
  "shortName": "usc",
  "slug": "ub-smart-chain",
  "testnet": false
} as const satisfies Chain;