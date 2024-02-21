import type { Chain } from "../src/types";
export default {
  "chain": "Gesoten Verse",
  "chainId": 42801,
  "explorers": [
    {
      "name": "Gesoten Verse Testnet Explorer",
      "url": "https://explorer.testnet.verse.gesoten.com",
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
  "name": "Gesoten Verse Testnet",
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "networkId": 42801,
  "rpc": [
    "https://42801.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.verse.gesoten.com/"
  ],
  "shortName": "GST",
  "slip44": 1,
  "slug": "gesoten-verse-testnet",
  "testnet": true
} as const satisfies Chain;