export default {
  "name": "CoinEx Smart Chain Testnet",
  "chain": "CSC",
  "rpc": [
    "https://coinex-smart-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.coinex.net/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "CoinEx Chain Test Native Token",
    "symbol": "cett",
    "decimals": 18
  },
  "infoURL": "https://www.coinex.org/",
  "shortName": "tcet",
  "chainId": 53,
  "networkId": 53,
  "explorers": [
    {
      "name": "coinexscan",
      "url": "https://testnet.coinex.net",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "coinex-smart-chain-testnet"
} as const;