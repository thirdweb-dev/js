import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 9997,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet-rollup-explorer.altlayer.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmcEfZJU7NMn9ycTAcEooQgGNfa2nYBToSUZHdFCFadcjb",
    "width": 1080,
    "height": 1025,
    "format": "png"
  },
  "infoURL": "https://altlayer.io",
  "name": "AltLayer Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 9997,
  "rpc": [
    "https://altlayer-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://9997.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rollup-api.altlayer.io"
  ],
  "shortName": "alt-testnet",
  "slug": "altlayer-testnet",
  "testnet": true
} as const satisfies Chain;