export default {
  "name": "JIBCHAIN L1",
  "chain": "JBC",
  "rpc": [
    "https://jibchain-l1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-l1.jibchain.net"
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
    "name": "JIBCOIN",
    "symbol": "JBC",
    "decimals": 18
  },
  "infoURL": "https://jibchain.net",
  "shortName": "jbc",
  "chainId": 8899,
  "networkId": 8899,
  "explorers": [
    {
      "name": "JIBCHAIN Explorer",
      "url": "https://exp-l1.jibchain.net",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "jibchain-l1"
} as const;