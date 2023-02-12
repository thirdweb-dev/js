export default {
  "name": "JFIN Chain",
  "chain": "JFIN",
  "rpc": [
    "https://jfin-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.jfinchain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "JFIN Coin",
    "symbol": "jfin",
    "decimals": 18
  },
  "infoURL": "https://jfinchain.com",
  "shortName": "jfin",
  "chainId": 3501,
  "networkId": 3501,
  "explorers": [
    {
      "name": "JFIN Chain Explorer",
      "url": "https://exp.jfinchain.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "jfin-chain"
} as const;