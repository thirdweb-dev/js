import type { Chain } from "../src/types";
export default {
  "chain": "Kortho Chain",
  "chainId": 2559,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.kortho.io/",
  "name": "Kortho Mainnet",
  "nativeCurrency": {
    "name": "KorthoChain",
    "symbol": "KTO",
    "decimals": 11
  },
  "redFlags": [],
  "rpc": [
    "https://kortho.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://www.kortho-chain.com"
  ],
  "shortName": "ktoc",
  "slug": "kortho",
  "testnet": false
} as const satisfies Chain;