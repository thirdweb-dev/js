import type { Chain } from "../src/types";
export default {
  "chainId": 8881,
  "chain": "UNQ",
  "name": "Quartz by Unique",
  "rpc": [
    "https://quartz-by-unique.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-quartz.unique.network",
    "https://quartz.api.onfinality.io/public-ws",
    "https://eu-rpc-quartz.unique.network",
    "https://asia-rpc-quartz.unique.network",
    "https://us-rpc-quartz.unique.network"
  ],
  "slug": "quartz-by-unique",
  "icon": {
    "url": "ipfs://QmaGPdccULQEFcCGxzstnmE8THfac2kSiGwvWRAiaRq4dp",
    "width": 48,
    "height": 48,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Quartz",
    "symbol": "QTZ",
    "decimals": 18
  },
  "infoURL": "https://unique.network",
  "shortName": "qtz",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Unique Scan / Quartz",
      "url": "https://uniquescan.io/quartz",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;