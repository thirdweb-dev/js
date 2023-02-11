export default {
  "name": "Toki Testnet",
  "chain": "TOKI",
  "rpc": [
    "https://toki-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.buildwithtoki.com/v0/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Toki",
    "symbol": "TOKI",
    "decimals": 18
  },
  "infoURL": "https://www.buildwithtoki.com",
  "shortName": "toki-testnet",
  "chainId": 8655,
  "networkId": 8655,
  "icon": {
    "url": "ipfs://QmbCBBH4dFHGr8u1yQspCieQG9hLcPFNYdRx1wnVsX8hUw",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "explorers": [],
  "testnet": true,
  "slug": "toki-testnet"
} as const;