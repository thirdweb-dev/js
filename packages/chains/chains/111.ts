import type { Chain } from "../src/types";
export default {
  "chainId": 111,
  "chain": "ETL",
  "name": "EtherLite Chain",
  "rpc": [
    "https://etherlite-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.etherlite.org"
  ],
  "slug": "etherlite-chain",
  "icon": {
    "url": "ipfs://QmbNAai1KnBnw4SPQKgrf6vBddifPCQTg2PePry1bmmZYy",
    "width": 88,
    "height": 88,
    "format": "png"
  },
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
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;