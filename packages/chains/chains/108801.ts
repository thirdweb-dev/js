export default {
  "name": "BROChain Mainnet",
  "chain": "BRO",
  "rpc": [
    "https://brochain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.brochain.org",
    "http://rpc.brochain.org",
    "https://rpc.brochain.org/mainnet",
    "http://rpc.brochain.org/mainnet"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Brother",
    "symbol": "BRO",
    "decimals": 18
  },
  "infoURL": "https://brochain.org",
  "shortName": "bro",
  "chainId": 108801,
  "networkId": 108801,
  "explorers": [
    {
      "name": "BROChain Explorer",
      "url": "https://explorer.brochain.org",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "brochain"
} as const;