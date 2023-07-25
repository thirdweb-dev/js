import type { Chain } from "../src/types";
export default {
  "name": "Avocado",
  "chain": "Avocado",
  "rpc": [
    "https://avocado.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.avocado.instadapp.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "USDC",
    "symbol": "USDC",
    "decimals": 18
  },
  "infoURL": "https://avocado.instadapp.io",
  "shortName": "avocado",
  "chainId": 634,
  "networkId": 634,
  "icon": {
    "url": "ipfs://Qma9rJSgy32UL1iXtXKFZQJA6FjkcUcDU4HR6y13Wu1vjn",
    "width": 600,
    "height": 600,
    "format": "png"
  },
  "explorers": [
    {
      "name": "avoscan",
      "url": "https://avoscan.co",
      "icon": {
        "url": "ipfs://Qma9rJSgy32UL1iXtXKFZQJA6FjkcUcDU4HR6y13Wu1vjn",
        "width": 600,
        "height": 600,
        "format": "png"
      },
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "avocado"
} as const satisfies Chain;