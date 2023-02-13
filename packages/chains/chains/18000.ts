export default {
  "name": "Frontier of Dreams Testnet",
  "chain": "Game Network",
  "rpc": [
    "https://frontier-of-dreams-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.fod.games/"
  ],
  "nativeCurrency": {
    "name": "ZKST",
    "symbol": "ZKST",
    "decimals": 18
  },
  "faucets": [],
  "shortName": "ZKST",
  "chainId": 18000,
  "networkId": 18000,
  "infoURL": "https://goexosphere.com",
  "explorers": [
    {
      "name": "Game Network",
      "url": "https://explorer.fod.games",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "frontier-of-dreams-testnet"
} as const;