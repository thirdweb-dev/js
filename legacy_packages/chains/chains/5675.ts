import type { Chain } from "../src/types";
export default {
  "chain": "Filenova",
  "chainId": 5675,
  "explorers": [
    {
      "name": "filenova testnet explorer",
      "url": "https://scantest.filenova.org",
      "standard": "none",
      "icon": {
        "url": "ipfs://Qmc4KSKiAChhtN7ZNE5gvkLTRbvtLreKU9xaQFG8BKM8RE",
        "width": 1000,
        "height": 1000,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://Qmc4KSKiAChhtN7ZNE5gvkLTRbvtLreKU9xaQFG8BKM8RE",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "infoURL": "https://filenova.org",
  "name": "Filenova Testnet",
  "nativeCurrency": {
    "name": "Test Filecoin",
    "symbol": "tFIL",
    "decimals": 18
  },
  "networkId": 5675,
  "rpc": [
    "https://5675.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpctest.filenova.org"
  ],
  "shortName": "tfilenova",
  "slug": "filenova-testnet",
  "testnet": true
} as const satisfies Chain;