export default {
  "name": "Bobaopera Testnet",
  "chain": "Bobaopera Testnet",
  "rpc": [
    "https://bobaopera-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.bobaopera.boba.network",
    "wss://wss.testnet.bobaopera.boba.network",
    "https://replica.testnet.bobaopera.boba.network",
    "wss://replica-wss.testnet.bobaopera.boba.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Boba Token",
    "symbol": "BOBA",
    "decimals": 18
  },
  "infoURL": "https://boba.network",
  "shortName": "BobaoperaTestnet",
  "chainId": 4051,
  "networkId": 4051,
  "explorers": [
    {
      "name": "Bobaopera Testnet block explorer",
      "url": "https://blockexplorer.testnet.bobaopera.boba.network",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "bobaopera-testnet"
} as const;