import type { Chain } from "../src/types";
export default {
  "chainId": 201018,
  "chain": "Alaya",
  "name": "Alaya Mainnet",
  "rpc": [
    "https://alaya.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://openapi.alaya.network/rpc",
    "wss://openapi.alaya.network/ws"
  ],
  "slug": "alaya",
  "icon": {
    "url": "ipfs://Qmci6vPcWAwmq19j98yuQxjV6UPzHtThMdCAUDbKeb8oYu",
    "width": 1140,
    "height": 1140,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "ATP",
    "symbol": "atp",
    "decimals": 18
  },
  "infoURL": "https://www.alaya.network/",
  "shortName": "alaya",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "alaya explorer",
      "url": "https://scan.alaya.network",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;