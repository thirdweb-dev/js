import type { Chain } from "../src/types";
export default {
  "chain": "Seele",
  "chainId": 186,
  "explorers": [
    {
      "name": "seeleview",
      "url": "https://seeleview.net",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://seelen.pro/",
  "name": "Seele Mainnet",
  "nativeCurrency": {
    "name": "Seele",
    "symbol": "Seele",
    "decimals": 18
  },
  "networkId": 186,
  "rpc": [
    "https://186.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.seelen.pro/"
  ],
  "shortName": "Seele",
  "slug": "seele",
  "testnet": false
} as const satisfies Chain;