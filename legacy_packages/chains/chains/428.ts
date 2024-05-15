import type { Chain } from "../src/types";
export default {
  "chain": "Geso Verse",
  "chainId": 428,
  "explorers": [
    {
      "name": "Geso Verse Explorer",
      "url": "https://explorer.verse.gesoten.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://Qmb7oJY9zd9sTzxNNQNTVZQz2hkd1aA94mWm4cvXfJ9QxV",
    "width": 1280,
    "height": 1280,
    "format": "png"
  },
  "infoURL": "https://gesoten.com/",
  "name": "Geso Verse",
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "networkId": 428,
  "rpc": [
    "https://428.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.verse.gesoten.com/"
  ],
  "shortName": "GSV",
  "slug": "geso-verse",
  "testnet": false
} as const satisfies Chain;