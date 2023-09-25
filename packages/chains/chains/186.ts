import type { Chain } from "../src/types";
export default {
  "chainId": 186,
  "chain": "Seele",
  "name": "Seele Mainnet",
  "rpc": [
    "https://seele.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.seelen.pro/"
  ],
  "slug": "seele",
  "faucets": [],
  "nativeCurrency": {
    "name": "Seele",
    "symbol": "Seele",
    "decimals": 18
  },
  "infoURL": "https://seelen.pro/",
  "shortName": "Seele",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "seeleview",
      "url": "https://seeleview.net",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;