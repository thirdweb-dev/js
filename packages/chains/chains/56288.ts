export default {
  "name": "Boba BNB Mainnet",
  "chain": "Boba BNB Mainnet",
  "rpc": [
    "https://boba-bnb.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://bnb.boba.network",
    "wss://wss.bnb.boba.network",
    "https://replica.bnb.boba.network",
    "wss://replica-wss.bnb.boba.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Boba Token",
    "symbol": "BOBA",
    "decimals": 18
  },
  "infoURL": "https://boba.network",
  "shortName": "BobaBnb",
  "chainId": 56288,
  "networkId": 56288,
  "explorers": [
    {
      "name": "Boba BNB block explorer",
      "url": "https://blockexplorer.bnb.boba.network",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "boba-bnb"
} as const;