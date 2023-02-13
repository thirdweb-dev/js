export default {
  "name": "Bobabeam",
  "chain": "Bobabeam",
  "rpc": [
    "https://bobabeam.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://bobabeam.boba.network",
    "wss://wss.bobabeam.boba.network",
    "https://replica.bobabeam.boba.network",
    "wss://replica-wss.bobabeam.boba.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Boba Token",
    "symbol": "BOBA",
    "decimals": 18
  },
  "infoURL": "https://boba.network",
  "shortName": "Bobabeam",
  "chainId": 1294,
  "networkId": 1294,
  "explorers": [
    {
      "name": "Bobabeam block explorer",
      "url": "https://blockexplorer.bobabeam.boba.network",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "bobabeam"
} as const;