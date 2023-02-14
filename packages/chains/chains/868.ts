export default {
  "name": "Fantasia Chain Mainnet",
  "chain": "FSC",
  "rpc": [
    "https://fantasia-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-data1.fantasiachain.com/",
    "https://mainnet-data2.fantasiachain.com/",
    "https://mainnet-data3.fantasiachain.com/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "FST",
    "symbol": "FST",
    "decimals": 18
  },
  "infoURL": "https://fantasia.technology/",
  "shortName": "FSCMainnet",
  "chainId": 868,
  "networkId": 868,
  "explorers": [
    {
      "name": "FSCScan",
      "url": "https://explorer.fantasiachain.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "fantasia-chain"
} as const;