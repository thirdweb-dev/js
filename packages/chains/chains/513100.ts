export default {
  "name": "ethereum Fair",
  "chainId": 513100,
  "networkId": 513100,
  "shortName": "etf",
  "chain": "ETF",
  "nativeCurrency": {
    "name": "EthereumFair",
    "symbol": "ETHF",
    "decimals": 18
  },
  "rpc": [
    "https://rpc.etherfair.org"
  ],
  "faucets": [],
  "explorers": [
    {
      "name": "etherfair",
      "url": "https://explorer.etherfair.org",
      "standard": "EIP3091"
    }
  ],
  "infoURL": "https://etherfair.org",
  "testnet": false,
  "slug": "ethereum-fair"
} as const;