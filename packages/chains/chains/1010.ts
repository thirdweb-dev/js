import type { Chain } from "../src/types";
export default {
  "chainId": 1010,
  "chain": "EVC",
  "name": "Evrice Network",
  "rpc": [
    "https://evrice-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://meta.evrice.com"
  ],
  "slug": "evrice-network",
  "faucets": [],
  "nativeCurrency": {
    "name": "Evrice",
    "symbol": "EVC",
    "decimals": 18
  },
  "infoURL": "https://evrice.com",
  "shortName": "EVC",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;