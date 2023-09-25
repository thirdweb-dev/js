import type { Chain } from "../src/types";
export default {
  "chainId": 1440,
  "chain": "LAS",
  "name": "Living Assets Mainnet",
  "rpc": [
    "https://living-assets.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://beta.mainnet.livingassets.io/rpc",
    "https://gamma.mainnet.livingassets.io/rpc"
  ],
  "slug": "living-assets",
  "icon": {
    "url": "ipfs://QmRidubY7BVwC737BQwGEttenP1npAXN7ZNryktE416uUW",
    "width": 500,
    "height": 500,
    "format": "jpg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "LAS",
    "symbol": "LAS",
    "decimals": 18
  },
  "infoURL": "https://dev.livingassets.io/",
  "shortName": "LAS",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;