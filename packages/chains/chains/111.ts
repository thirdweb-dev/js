import type { Chain } from "../src/types";
export default {
  "chain": "ETL",
  "chainId": 111,
  "explorers": [],
  "faucets": [
    "https://etherlite.org/faucets"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmbNAai1KnBnw4SPQKgrf6vBddifPCQTg2PePry1bmmZYy",
    "width": 88,
    "height": 88,
    "format": "png"
  },
  "infoURL": "https://etherlite.org",
  "name": "EtherLite Chain",
  "nativeCurrency": {
    "name": "EtherLite",
    "symbol": "ETL",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://etherlite-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.etherlite.org"
  ],
  "shortName": "ETL",
  "slug": "etherlite-chain",
  "testnet": false
} as const satisfies Chain;