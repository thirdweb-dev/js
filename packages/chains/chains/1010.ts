import type { Chain } from "../src/types";
export default {
  "chain": "EVC",
  "chainId": 1010,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://evrice.com",
  "name": "Evrice Network",
  "nativeCurrency": {
    "name": "Evrice",
    "symbol": "EVC",
    "decimals": 18
  },
  "networkId": 1010,
  "rpc": [
    "https://evrice-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1010.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://meta.evrice.com"
  ],
  "shortName": "EVC",
  "slip44": 1020,
  "slug": "evrice-network",
  "testnet": false
} as const satisfies Chain;