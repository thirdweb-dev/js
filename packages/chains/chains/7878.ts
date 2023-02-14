export default {
  "name": "Hazlor Testnet",
  "chain": "SCAS",
  "rpc": [
    "https://hazlor-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://hatlas.rpc.hazlor.com:8545",
    "wss://hatlas.rpc.hazlor.com:8546"
  ],
  "faucets": [
    "https://faucet.hazlor.com"
  ],
  "nativeCurrency": {
    "name": "Hazlor Test Coin",
    "symbol": "TSCAS",
    "decimals": 18
  },
  "infoURL": "https://hazlor.com",
  "shortName": "tscas",
  "chainId": 7878,
  "networkId": 7878,
  "explorers": [
    {
      "name": "Hazlor Testnet Explorer",
      "url": "https://explorer.hazlor.com",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "hazlor-testnet"
} as const;