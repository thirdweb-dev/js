import type { Chain } from "../types";
export default {
  "chain": "UNQ",
  "chainId": 8881,
  "explorers": [
    {
      "name": "Unique Scan / Quartz",
      "url": "https://uniquescan.io/quartz",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmaGPdccULQEFcCGxzstnmE8THfac2kSiGwvWRAiaRq4dp",
    "width": 48,
    "height": 48,
    "format": "svg"
  },
  "infoURL": "https://unique.network",
  "name": "Quartz by Unique",
  "nativeCurrency": {
    "name": "Quartz",
    "symbol": "QTZ",
    "decimals": 18
  },
  "networkId": 8881,
  "rpc": [
    "https://quartz-by-unique.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://8881.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-quartz.unique.network",
    "https://quartz.api.onfinality.io/public-ws",
    "https://eu-rpc-quartz.unique.network",
    "https://asia-rpc-quartz.unique.network",
    "https://us-rpc-quartz.unique.network"
  ],
  "shortName": "qtz",
  "slug": "quartz-by-unique",
  "testnet": false
} as const satisfies Chain;