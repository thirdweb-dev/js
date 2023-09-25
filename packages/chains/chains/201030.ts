import type { Chain } from "../src/types";
export default {
  "chainId": 201030,
  "chain": "Alaya",
  "name": "Alaya Dev Testnet",
  "rpc": [
    "https://alaya-dev-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnetopenapi.alaya.network/rpc",
    "wss://devnetopenapi.alaya.network/ws"
  ],
  "slug": "alaya-dev-testnet",
  "icon": {
    "url": "ipfs://Qmci6vPcWAwmq19j98yuQxjV6UPzHtThMdCAUDbKeb8oYu",
    "width": 1140,
    "height": 1140,
    "format": "png"
  },
  "faucets": [
    "https://faucet.alaya.network/faucet/?id=f93426c0887f11eb83b900163e06151c"
  ],
  "nativeCurrency": {
    "name": "ATP",
    "symbol": "atp",
    "decimals": 18
  },
  "infoURL": "https://www.alaya.network/",
  "shortName": "alayadev",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "alaya explorer",
      "url": "https://devnetscan.alaya.network",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;