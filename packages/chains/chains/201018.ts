export default {
  "name": "Alaya Mainnet",
  "chain": "Alaya",
  "rpc": [
    "https://alaya.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://openapi.alaya.network/rpc",
    "wss://openapi.alaya.network/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ATP",
    "symbol": "atp",
    "decimals": 18
  },
  "infoURL": "https://www.alaya.network/",
  "shortName": "alaya",
  "chainId": 201018,
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
      "url": "https://scan.alaya.network",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "alaya"
} as const;