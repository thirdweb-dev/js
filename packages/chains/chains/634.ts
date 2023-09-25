import type { Chain } from "../src/types";
export default {
  "chainId": 634,
  "chain": "Avocado",
  "name": "Avocado",
  "rpc": [
    "https://avocado.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.avocado.instadapp.io"
  ],
  "slug": "avocado",
  "icon": {
    "url": "ipfs://Qma9rJSgy32UL1iXtXKFZQJA6FjkcUcDU4HR6y13Wu1vjn",
    "width": 600,
    "height": 600,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "USDC",
    "symbol": "USDC",
    "decimals": 18
  },
  "infoURL": "https://avocado.instadapp.io",
  "shortName": "avocado",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "avoscan",
      "url": "https://avoscan.co",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;