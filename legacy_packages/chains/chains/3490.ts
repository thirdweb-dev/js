import type { Chain } from "../src/types";
export default {
  "chain": "GTC",
  "chainId": 3490,
  "explorers": [
    {
      "name": "GTCScan Explorer",
      "url": "https://gtcscan.io",
      "standard": "none",
      "icon": {
        "url": "ipfs://bafybeiaaq7gogws6uqcvo6imxbxfgpdhewybh7bxgtfny2i2as5nidbdje",
        "width": 312,
        "height": 312,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafybeiaaq7gogws6uqcvo6imxbxfgpdhewybh7bxgtfny2i2as5nidbdje",
    "width": 312,
    "height": 312,
    "format": "png"
  },
  "infoURL": "https://gtcscan.io/",
  "name": "GTCSCAN",
  "nativeCurrency": {
    "name": "GTC",
    "symbol": "GTC",
    "decimals": 18
  },
  "networkId": 3490,
  "rpc": [
    "https://3490.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://gtc-dataseed.gtcscan.io/"
  ],
  "shortName": "gtc",
  "slip44": 1,
  "slug": "gtcscan",
  "testnet": false
} as const satisfies Chain;