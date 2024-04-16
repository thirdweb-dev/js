import type { Chain } from "../src/types";
export default {
  "chain": "KLAOS Nova",
  "chainId": 27181,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.klaosnova.laosfoundation.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmW26eoxJeyUfikZ4DUT1Gfk78sBkvydEo8QzHa1BXjUUL",
        "width": 580,
        "height": 580,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmW26eoxJeyUfikZ4DUT1Gfk78sBkvydEo8QzHa1BXjUUL",
    "width": 580,
    "height": 580,
    "format": "png"
  },
  "infoURL": "https://www.laosfoundation.io/",
  "name": "KLAOS Nova",
  "nativeCurrency": {
    "name": "KLAOS",
    "symbol": "KLAOS",
    "decimals": 18
  },
  "networkId": 27181,
  "rpc": [
    "https://27181.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.klaosnova.laosfoundation.io",
    "wss://rpc.klaosnova.laosfoundation.io"
  ],
  "shortName": "klaosnova",
  "slug": "klaos-nova",
  "testnet": true,
  "title": "KLAOS Nova Test Chain"
} as const satisfies Chain;