import type { Chain } from "../src/types";
export default {
  "chain": "BFC",
  "chainId": 3068,
  "explorers": [
    {
      "name": "explorer-thebifrost",
      "url": "https://explorer.mainnet.thebifrost.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmYxniqbiFD7nXBNjN8boUhoXYEAW23YquArD2Rnkq8WHS",
    "width": 480,
    "height": 480,
    "format": "png"
  },
  "infoURL": "https://thebifrost.io",
  "name": "Bifrost Mainnet",
  "nativeCurrency": {
    "name": "Bifrost",
    "symbol": "BFC",
    "decimals": 18
  },
  "networkId": 3068,
  "rpc": [
    "https://3068.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://public-01.mainnet.thebifrost.io/rpc",
    "https://public-02.mainnet.thebifrost.io/rpc"
  ],
  "shortName": "bfc",
  "slug": "bifrost",
  "testnet": false,
  "title": "Bifrost Network Mainnet"
} as const satisfies Chain;