import type { Chain } from "../src/types";
export default {
  "chain": "Unified",
  "chainId": 431140,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://www.markr.io/",
  "name": "Markr Go",
  "nativeCurrency": {
    "name": "Avalanche",
    "symbol": "AVAX",
    "decimals": 18
  },
  "networkId": 431140,
  "rpc": [
    "https://431140.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.markr.io/ext/"
  ],
  "shortName": "markr-go",
  "slug": "markr-go",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;