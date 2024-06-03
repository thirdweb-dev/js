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