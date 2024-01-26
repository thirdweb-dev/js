import type { Chain } from "../src/types";
export default {
  "chain": "LAS",
  "chainId": 1440,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmRidubY7BVwC737BQwGEttenP1npAXN7ZNryktE416uUW",
    "width": 500,
    "height": 500,
    "format": "jpg"
  },
  "infoURL": "https://dev.livingassets.io/",
  "name": "Living Assets Mainnet",
  "nativeCurrency": {
    "name": "LAS",
    "symbol": "LAS",
    "decimals": 18
  },
  "networkId": 1440,
  "rpc": [
    "https://living-assets.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1440.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://beta.mainnet.livingassets.io/rpc",
    "https://gamma.mainnet.livingassets.io/rpc"
  ],
  "shortName": "LAS",
  "slug": "living-assets",
  "testnet": false
} as const satisfies Chain;