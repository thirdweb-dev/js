import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 4000003,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://zero-explorer.alt.technology",
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
  "name": "AltLayer Zero Gas Network",
  "nativeCurrency": {
    "name": "ZERO",
    "symbol": "ZERO",
    "decimals": 18
  },
  "networkId": 4000003,
  "rpc": [
    "https://altlayer-zero-gas-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://4000003.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://zero.alt.technology"
  ],
  "shortName": "alt-zerogas",
  "slug": "altlayer-zero-gas-network",
  "testnet": false
} as const satisfies Chain;