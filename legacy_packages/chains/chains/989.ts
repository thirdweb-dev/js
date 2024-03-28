import type { Chain } from "../src/types";
export default {
  "chain": "TOP",
  "chainId": 989,
  "explorers": [
    {
      "name": "topscan.dev",
      "url": "https://www.topscan.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmYikaM849eZrL8pGNeVhEHVTKWpxdGMvCY5oFBfZ2ndhd",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "infoURL": "https://www.topnetwork.org/",
  "name": "TOP Mainnet",
  "nativeCurrency": {
    "name": "TOP",
    "symbol": "TOP",
    "decimals": 6
  },
  "networkId": 0,
  "rpc": [],
  "shortName": "top",
  "slug": "top",
  "testnet": false
} as const satisfies Chain;