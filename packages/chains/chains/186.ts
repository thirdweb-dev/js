export default {
  "name": "Seele Mainnet",
  "chain": "Seele",
  "rpc": [
    "https://seele.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.seelen.pro/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Seele",
    "symbol": "Seele",
    "decimals": 18
  },
  "infoURL": "https://seelen.pro/",
  "shortName": "Seele",
  "chainId": 186,
  "networkId": 186,
  "explorers": [
    {
      "name": "seeleview",
      "url": "https://seeleview.net",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "seele"
} as const;