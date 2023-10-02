import type { Chain } from "../src/types";
export default {
  "chain": "Alaya",
  "chainId": 201018,
  "explorers": [
    {
      "name": "alaya explorer",
      "url": "https://scan.alaya.network",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://Qmci6vPcWAwmq19j98yuQxjV6UPzHtThMdCAUDbKeb8oYu",
    "width": 1140,
    "height": 1140,
    "format": "png"
  },
  "infoURL": "https://www.alaya.network/",
  "name": "Alaya Mainnet",
  "nativeCurrency": {
    "name": "ATP",
    "symbol": "atp",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://alaya.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://openapi.alaya.network/rpc",
    "wss://openapi.alaya.network/ws"
  ],
  "shortName": "alaya",
  "slug": "alaya",
  "testnet": false
} as const satisfies Chain;