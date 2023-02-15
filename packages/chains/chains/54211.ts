export default {
  "name": "Haqq Chain Testnet",
  "chain": "TestEdge2",
  "rpc": [
    "https://haqq-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.eth.testedge2.haqq.network"
  ],
  "faucets": [
    "https://testedge2.haqq.network"
  ],
  "nativeCurrency": {
    "name": "Islamic Coin",
    "symbol": "ISLMT",
    "decimals": 18
  },
  "infoURL": "https://islamiccoin.net",
  "shortName": "ISLMT",
  "chainId": 54211,
  "networkId": 54211,
  "explorers": [
    {
      "name": "TestEdge HAQQ Explorer",
      "url": "https://explorer.testedge2.haqq.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "haqq-chain-testnet"
} as const;