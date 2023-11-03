import type { Chain } from "../types";
export default {
  "chain": "UNQ",
  "chainId": 8880,
  "explorers": [
    {
      "name": "Unique Scan",
      "url": "https://uniquescan.io/unique",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmbJ7CGZ2GxWMp7s6jy71UGzRsMe4w3KANKXDAExYWdaFR",
    "width": 48,
    "height": 48,
    "format": "svg"
  },
  "infoURL": "https://unique.network",
  "name": "Unique",
  "nativeCurrency": {
    "name": "Unique",
    "symbol": "UNQ",
    "decimals": 18
  },
  "networkId": 8880,
  "rpc": [
    "https://unique.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://8880.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.unique.network",
    "https://eu-rpc.unique.network",
    "https://asia-rpc.unique.network",
    "https://us-rpc.unique.network"
  ],
  "shortName": "unq",
  "slug": "unique",
  "testnet": false
} as const satisfies Chain;