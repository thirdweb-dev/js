import type { Chain } from "../src/types";
export default {
  "chain": "GEEK",
  "chainId": 75512,
  "explorers": [
    {
      "name": "Geek Explorer",
      "url": "https://explorer.geekout-pte.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.geekout-pte.com",
  "name": "GEEK Verse Mainnet",
  "nativeCurrency": {
    "name": "Geek",
    "symbol": "GEEK",
    "decimals": 18
  },
  "networkId": 75512,
  "rpc": [
    "https://75512.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.geekout-pte.com"
  ],
  "shortName": "GEEK",
  "slug": "geek-verse",
  "testnet": false
} as const satisfies Chain;