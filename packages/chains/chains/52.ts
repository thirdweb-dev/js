export default {
  "name": "CoinEx Smart Chain Mainnet",
  "chain": "CSC",
  "rpc": [
    "https://coinex-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.coinex.net"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "CoinEx Chain Native Token",
    "symbol": "cet",
    "decimals": 18
  },
  "infoURL": "https://www.coinex.org/",
  "shortName": "cet",
  "chainId": 52,
  "networkId": 52,
  "explorers": [
    {
      "name": "coinexscan",
      "url": "https://www.coinex.net",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "coinex-smart-chain"
} as const;