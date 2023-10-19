import type { Chain } from "../src/types";
export default {
  "chain": "MUSIC",
  "chainId": 7762959,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://musicoin.tw",
  "name": "Musicoin",
  "nativeCurrency": {
    "name": "Musicoin",
    "symbol": "MUSIC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://musicoin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mewapi.musicoin.tw"
  ],
  "shortName": "music",
  "slug": "musicoin",
  "testnet": false
} as const satisfies Chain;