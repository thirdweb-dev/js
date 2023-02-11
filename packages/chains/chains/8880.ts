export default {
  "name": "Unique",
  "icon": {
    "url": "ipfs://QmbJ7CGZ2GxWMp7s6jy71UGzRsMe4w3KANKXDAExYWdaFR",
    "width": 48,
    "height": 48,
    "format": "svg"
  },
  "chain": "UNQ",
  "rpc": [
    "https://unique.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.unique.network",
    "https://eu-rpc.unique.network",
    "https://asia-rpc.unique.network",
    "https://us-rpc.unique.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Unique",
    "symbol": "UNQ",
    "decimals": 18
  },
  "infoURL": "https://unique.network",
  "shortName": "unq",
  "chainId": 8880,
  "networkId": 8880,
  "explorers": [
    {
      "name": "Unique Scan",
      "url": "https://uniquescan.io/unique",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "unique"
} as const;