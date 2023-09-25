import type { Chain } from "../src/types";
export default {
  "chainId": 8883,
  "chain": "UNQ",
  "name": "Sapphire by Unique",
  "rpc": [
    "https://sapphire-by-unique.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-sapphire.unique.network",
    "https://us-rpc-sapphire.unique.network",
    "https://eu-rpc-sapphire.unique.network",
    "https://asia-rpc-sapphire.unique.network"
  ],
  "slug": "sapphire-by-unique",
  "icon": {
    "url": "ipfs://Qmd1PGt4cDRjFbh4ihP5QKEd4XQVwN1MkebYKdF56V74pf",
    "width": 48,
    "height": 48,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Quartz",
    "symbol": "QTZ",
    "decimals": 18
  },
  "infoURL": "https://unique.network",
  "shortName": "sph",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Unique Scan / Sapphire",
      "url": "https://uniquescan.io/sapphire",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;