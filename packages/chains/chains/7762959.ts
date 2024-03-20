import type { Chain } from "../src/types";
export default {
  "chain": "MUSIC",
  "chainId": 7762959,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://musicoin.tw",
  "name": "Musicoin",
  "nativeCurrency": {
    "name": "Musicoin",
    "symbol": "MUSIC",
    "decimals": 18
  },
  "networkId": 7762959,
  "rpc": [
    "https://7762959.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mewapi.musicoin.tw"
  ],
  "shortName": "music",
  "slip44": 184,
  "slug": "musicoin",
  "testnet": false
} as const satisfies Chain;