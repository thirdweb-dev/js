export default {
  "name": "Candle",
  "chain": "Candle",
  "rpc": [
    "https://candle.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://candle-rpc.com/",
    "https://rpc.cndlchain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "CANDLE",
    "symbol": "CNDL",
    "decimals": 18
  },
  "infoURL": "https://candlelabs.org/",
  "shortName": "CNDL",
  "chainId": 534,
  "networkId": 534,
  "slip44": 674,
  "explorers": [
    {
      "name": "candleexplorer",
      "url": "https://candleexplorer.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "candle"
} as const;