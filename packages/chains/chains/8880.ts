import type { Chain } from "../src/types";
export default {
  "chainId": 8880,
  "chain": "UNQ",
  "name": "Unique",
  "rpc": [
    "https://unique.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.unique.network",
    "https://eu-rpc.unique.network",
    "https://asia-rpc.unique.network",
    "https://us-rpc.unique.network"
  ],
  "slug": "unique",
  "icon": {
    "url": "ipfs://QmbJ7CGZ2GxWMp7s6jy71UGzRsMe4w3KANKXDAExYWdaFR",
    "width": 48,
    "height": 48,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Unique",
    "symbol": "UNQ",
    "decimals": 18
  },
  "infoURL": "https://unique.network",
  "shortName": "unq",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Unique Scan",
      "url": "https://uniquescan.io/unique",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;