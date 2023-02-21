export default {
  "name": "ThaiChain",
  "chain": "TCH",
  "rpc": [
    "https://thaichain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.dome.cloud",
    "https://rpc.thaichain.org"
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "nativeCurrency": {
    "name": "ThaiChain Ether",
    "symbol": "TCH",
    "decimals": 18
  },
  "infoURL": "https://thaichain.io",
  "shortName": "tch",
  "chainId": 7,
  "networkId": 7,
  "explorers": [
    {
      "name": "Thaichain Explorer",
      "url": "https://exp.thaichain.org",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "thaichain"
} as const;