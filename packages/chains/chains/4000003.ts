import type { Chain } from "../src/types";
export default {
  "name": "AltLayer Zero Gas Network",
  "chain": "ETH",
  "rpc": [
    "https://altlayer-zero-gas-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://zero.alt.technology"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ZERO",
    "symbol": "ZERO",
    "decimals": 18
  },
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://altlayer.io",
  "shortName": "alt-zerogas",
  "chainId": 4000003,
  "networkId": 4000003,
  "icon": {
    "url": "ipfs://QmcEfZJU7NMn9ycTAcEooQgGNfa2nYBToSUZHdFCFadcjb",
    "width": 1080,
    "height": 1025,
    "format": "png"
  },
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://zero-explorer.alt.technology",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "altlayer-zero-gas-network"
} as const satisfies Chain;