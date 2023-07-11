import type { Chain } from "../src/types";
export default {
  "name": "Living Assets Mainnet",
  "chain": "LAS",
  "icon": {
    "url": "ipfs://QmRidubY7BVwC737BQwGEttenP1npAXN7ZNryktE416uUW",
    "width": 500,
    "height": 500,
    "format": "jpg"
  },
  "rpc": [
    "https://living-assets.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://beta.mainnet.livingassets.io/rpc",
    "https://gamma.mainnet.livingassets.io/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "LAS",
    "symbol": "LAS",
    "decimals": 18
  },
  "infoURL": "https://dev.livingassets.io/",
  "shortName": "LAS",
  "chainId": 1440,
  "networkId": 1440,
  "testnet": false,
  "slug": "living-assets"
} as const satisfies Chain;