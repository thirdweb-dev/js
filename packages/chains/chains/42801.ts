import type { Chain } from "../src/types";
export default {
  "name": "Gesoten Verse Testnet",
  "chain": "Gesoten Verse",
  "rpc": [
    "https://gesoten-verse-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.verse.gesoten.com/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OAS",
    "symbol": "OAS",
    "decimals": 18
  },
  "infoURL": "https://gesoten.com/",
  "shortName": "GST",
  "icon": {
    "url": "ipfs://Qmb7oJY9zd9sTzxNNQNTVZQz2hkd1aA94mWm4cvXfJ9QxV",
    "width": 1280,
    "height": 1280,
    "format": "png"
  },
  "chainId": 42801,
  "networkId": 42801,
  "explorers": [
    {
      "name": "Gesoten Verse Testnet Explorer",
      "url": "https://explorer.testnet.verse.gesoten.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "gesoten-verse-testnet"
} as const satisfies Chain;