import type { Chain } from "../src/types";
export default {
  "chain": "Filenova",
  "chainId": 579,
  "explorers": [
    {
      "name": "filenova explorer",
      "url": "https://scan.filenova.org",
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
  "name": "Filenova Mainnet",
  "nativeCurrency": {
    "name": "Filecoin",
    "symbol": "FIL",
    "decimals": 18
  },
  "networkId": 579,
  "rpc": [
    "https://579.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.filenova.org"
  ],
  "shortName": "filenova",
  "slug": "filenova",
  "testnet": false
} as const satisfies Chain;