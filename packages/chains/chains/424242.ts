export default {
  "name": "Fastex Chain testnet",
  "chain": "FTN",
  "title": "Fastex Chain testnet",
  "rpc": [
    "https://fastex-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.fastexchain.com"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "FTN",
    "symbol": "FTN",
    "decimals": 18
  },
  "infoURL": "https://fastex.com",
  "shortName": "ftn",
  "chainId": 424242,
  "networkId": 424242,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet.ftnscan.com",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "fastex-chain-testnet"
} as const;