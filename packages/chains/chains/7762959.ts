import type { Chain } from "../src/types";
export default {
  "chainId": 7762959,
  "chain": "MUSIC",
  "name": "Musicoin",
  "rpc": [
    "https://musicoin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mewapi.musicoin.tw"
  ],
  "slug": "musicoin",
  "faucets": [],
  "nativeCurrency": {
    "name": "Musicoin",
    "symbol": "MUSIC",
    "decimals": 18
  },
  "infoURL": "https://musicoin.tw",
  "shortName": "music",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;