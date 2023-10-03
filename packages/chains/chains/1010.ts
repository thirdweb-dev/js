import type { Chain } from "../src/types";
export default {
  "chain": "EVC",
  "chainId": 1010,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://evrice.com",
  "name": "Evrice Network",
  "nativeCurrency": {
    "name": "Evrice",
    "symbol": "EVC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://evrice-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://meta.evrice.com"
  ],
  "shortName": "EVC",
  "slug": "evrice-network",
  "testnet": false
} as const satisfies Chain;