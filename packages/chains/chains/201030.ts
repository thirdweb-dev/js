export default {
  "name": "Alaya Dev Testnet",
  "chain": "Alaya",
  "rpc": [
    "https://alaya-dev-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnetopenapi.alaya.network/rpc",
    "wss://devnetopenapi.alaya.network/ws"
  ],
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
  "chainId": 201030,
  "networkId": 1,
  "icon": {
    "url": "ipfs://Qmci6vPcWAwmq19j98yuQxjV6UPzHtThMdCAUDbKeb8oYu",
    "width": 1140,
    "height": 1140,
    "format": "png"
  },
  "explorers": [
    {
      "name": "alaya explorer",
      "url": "https://devnetscan.alaya.network",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "alaya-dev-testnet"
} as const;