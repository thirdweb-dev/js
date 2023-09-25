import type { Chain } from "../src/types";
export default {
  "chainId": 9997,
  "chain": "ETH",
  "name": "AltLayer Testnet",
  "rpc": [
    "https://altlayer-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rollup-api.altlayer.io"
  ],
  "slug": "altlayer-testnet",
  "icon": {
    "url": "ipfs://QmcEfZJU7NMn9ycTAcEooQgGNfa2nYBToSUZHdFCFadcjb",
    "width": 1080,
    "height": 1025,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://altlayer.io",
  "shortName": "alt-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet-rollup-explorer.altlayer.io",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;