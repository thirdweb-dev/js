export default {
  "name": "Bobafuji Testnet",
  "chain": "Bobafuji Testnet",
  "rpc": [
    "https://bobafuji-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.avax.boba.network",
    "wss://wss.testnet.avax.boba.network",
    "https://replica.testnet.avax.boba.network",
    "wss://replica-wss.testnet.avax.boba.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Boba Token",
    "symbol": "BOBA",
    "decimals": 18
  },
  "infoURL": "https://boba.network",
  "shortName": "BobaFujiTestnet",
  "chainId": 4328,
  "networkId": 4328,
  "explorers": [
    {
      "name": "Bobafuji Testnet block explorer",
      "url": "https://blockexplorer.testnet.avax.boba.network",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "bobafuji-testnet"
} as const;