import type { Chain } from "../src/types";
export default {
  "chain": "GEEK Test",
  "chainId": 75513,
  "explorers": [
    {
      "name": "Geek Testnet Explorer",
      "url": "https://explorer-testnet.geekout-pte.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.geekout-pte.com",
  "name": "GEEK Verse Testnet",
  "nativeCurrency": {
    "name": "Geek",
    "symbol": "GEEK",
    "decimals": 18
  },
  "networkId": 75513,
  "rpc": [
    "https://75513.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.geekout-pte.com"
  ],
  "shortName": "GEEK_Test",
  "slug": "geek-verse-testnet",
  "testnet": true
} as const satisfies Chain;