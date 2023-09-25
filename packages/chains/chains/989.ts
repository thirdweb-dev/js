import type { Chain } from "../src/types";
export default {
  "chainId": 989,
  "chain": "TOP",
  "name": "TOP Mainnet",
  "rpc": [],
  "slug": "top",
  "icon": {
    "url": "ipfs://QmYikaM849eZrL8pGNeVhEHVTKWpxdGMvCY5oFBfZ2ndhd",
    "width": 800,
    "height": 800,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "TOP",
    "symbol": "TOP",
    "decimals": 6
  },
  "infoURL": "https://www.topnetwork.org/",
  "shortName": "top",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "topscan.dev",
      "url": "https://www.topscan.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;