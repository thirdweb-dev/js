import type { Chain } from "../src/types";
export default {
  "chain": "Avocado",
  "chainId": 634,
  "explorers": [
    {
      "name": "avoscan",
      "url": "https://avoscan.co",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://Qma9rJSgy32UL1iXtXKFZQJA6FjkcUcDU4HR6y13Wu1vjn",
    "width": 600,
    "height": 600,
    "format": "png"
  },
  "infoURL": "https://avocado.instadapp.io",
  "name": "Avocado",
  "nativeCurrency": {
    "name": "USDC",
    "symbol": "USDC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://avocado.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.avocado.instadapp.io"
  ],
  "shortName": "avocado",
  "slug": "avocado",
  "testnet": false
} as const satisfies Chain;