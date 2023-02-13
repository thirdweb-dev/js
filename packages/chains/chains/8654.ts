export default {
  "name": "Toki Network",
  "chain": "TOKI",
  "rpc": [
    "https://toki-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.buildwithtoki.com/v0/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Toki",
    "symbol": "TOKI",
    "decimals": 18
  },
  "infoURL": "https://www.buildwithtoki.com",
  "shortName": "toki",
  "chainId": 8654,
  "networkId": 8654,
  "icon": {
    "url": "ipfs://QmbCBBH4dFHGr8u1yQspCieQG9hLcPFNYdRx1wnVsX8hUw",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "explorers": [],
  "testnet": false,
  "slug": "toki-network"
} as const;