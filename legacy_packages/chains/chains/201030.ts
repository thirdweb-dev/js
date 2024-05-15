import type { Chain } from "../src/types";
export default {
  "chain": "Alaya",
  "chainId": 201030,
  "explorers": [
    {
      "name": "alaya explorer",
      "url": "https://devnetscan.alaya.network",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet.alaya.network/faucet/?id=f93426c0887f11eb83b900163e06151c"
  ],
  "icon": {
    "url": "ipfs://Qmci6vPcWAwmq19j98yuQxjV6UPzHtThMdCAUDbKeb8oYu",
    "width": 1140,
    "height": 1140,
    "format": "png"
  },
  "infoURL": "https://www.alaya.network/",
  "name": "Alaya Dev Testnet",
  "nativeCurrency": {
    "name": "ATP",
    "symbol": "atp",
    "decimals": 18
  },
  "networkId": 1,
  "rpc": [
    "https://201030.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnetopenapi.alaya.network/rpc",
    "wss://devnetopenapi.alaya.network/ws"
  ],
  "shortName": "alayadev",
  "slip44": 1,
  "slug": "alaya-dev-testnet",
  "testnet": true
} as const satisfies Chain;