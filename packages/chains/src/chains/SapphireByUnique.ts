import type { Chain } from "../types";
export default {
  "chain": "UNQ",
  "chainId": 8883,
  "explorers": [
    {
      "name": "Unique Scan / Sapphire",
      "url": "https://uniquescan.io/sapphire",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://Qmd1PGt4cDRjFbh4ihP5QKEd4XQVwN1MkebYKdF56V74pf",
    "width": 48,
    "height": 48,
    "format": "svg"
  },
  "infoURL": "https://unique.network",
  "name": "Sapphire by Unique",
  "nativeCurrency": {
    "name": "Quartz",
    "symbol": "QTZ",
    "decimals": 18
  },
  "networkId": 8883,
  "rpc": [
    "https://sapphire-by-unique.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://8883.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-sapphire.unique.network",
    "https://us-rpc-sapphire.unique.network",
    "https://eu-rpc-sapphire.unique.network",
    "https://asia-rpc-sapphire.unique.network"
  ],
  "shortName": "sph",
  "slug": "sapphire-by-unique",
  "testnet": false
} as const satisfies Chain;