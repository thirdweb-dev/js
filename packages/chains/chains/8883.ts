export default {
  "name": "Sapphire by Unique",
  "icon": {
    "url": "ipfs://Qmd1PGt4cDRjFbh4ihP5QKEd4XQVwN1MkebYKdF56V74pf",
    "width": 48,
    "height": 48,
    "format": "svg"
  },
  "chain": "UNQ",
  "rpc": [
    "https://sapphire-by-unique.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-sapphire.unique.network",
    "https://us-rpc-sapphire.unique.network",
    "https://eu-rpc-sapphire.unique.network",
    "https://asia-rpc-sapphire.unique.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Quartz",
    "symbol": "QTZ",
    "decimals": 18
  },
  "infoURL": "https://unique.network",
  "shortName": "sph",
  "chainId": 8883,
  "networkId": 8883,
  "explorers": [
    {
      "name": "Unique Scan / Sapphire",
      "url": "https://uniquescan.io/sapphire",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "sapphire-by-unique"
} as const;