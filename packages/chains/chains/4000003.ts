import type { Chain } from "../src/types";
export default {
  "chainId": 4000003,
  "chain": "ETH",
  "name": "AltLayer Zero Gas Network",
  "rpc": [
    "https://altlayer-zero-gas-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://zero.alt.technology"
  ],
  "slug": "altlayer-zero-gas-network",
  "icon": {
    "url": "ipfs://QmcEfZJU7NMn9ycTAcEooQgGNfa2nYBToSUZHdFCFadcjb",
    "width": 1080,
    "height": 1025,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "ZERO",
    "symbol": "ZERO",
    "decimals": 18
  },
  "infoURL": "https://altlayer.io",
  "shortName": "alt-zerogas",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://zero-explorer.alt.technology",
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