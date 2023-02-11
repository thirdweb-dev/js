export default {
  "name": "Quartz by Unique",
  "icon": {
    "url": "ipfs://QmaGPdccULQEFcCGxzstnmE8THfac2kSiGwvWRAiaRq4dp",
    "width": 48,
    "height": 48,
    "format": "svg"
  },
  "chain": "UNQ",
  "rpc": [
    "https://quartz-by-unique.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-quartz.unique.network",
    "https://quartz.api.onfinality.io/public-ws",
    "https://eu-rpc-quartz.unique.network",
    "https://asia-rpc-quartz.unique.network",
    "https://us-rpc-quartz.unique.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Quartz",
    "symbol": "QTZ",
    "decimals": 18
  },
  "infoURL": "https://unique.network",
  "shortName": "qtz",
  "chainId": 8881,
  "networkId": 8881,
  "explorers": [
    {
      "name": "Unique Scan / Quartz",
      "url": "https://uniquescan.io/quartz",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "quartz-by-unique"
} as const;