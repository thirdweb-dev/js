export default {
  "name": "EtherLite Chain",
  "chain": "ETL",
  "rpc": [
    "https://etherlite-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.etherlite.org"
  ],
  "faucets": [
    "https://etherlite.org/faucets"
  ],
  "nativeCurrency": {
    "name": "EtherLite",
    "symbol": "ETL",
    "decimals": 18
  },
  "infoURL": "https://etherlite.org",
  "shortName": "ETL",
  "chainId": 111,
  "networkId": 111,
  "icon": {
    "url": "ipfs://QmbNAai1KnBnw4SPQKgrf6vBddifPCQTg2PePry1bmmZYy",
    "width": 88,
    "height": 88,
    "format": "png"
  },
  "testnet": false,
  "slug": "etherlite-chain"
} as const;