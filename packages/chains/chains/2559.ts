import type { Chain } from "../src/types";
export default {
  "chainId": 2559,
  "chain": "Kortho Chain",
  "name": "Kortho Mainnet",
  "rpc": [
    "https://kortho.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://www.kortho-chain.com"
  ],
  "slug": "kortho",
  "faucets": [],
  "nativeCurrency": {
    "name": "KorthoChain",
    "symbol": "KTO",
    "decimals": 11
  },
  "infoURL": "https://www.kortho.io/",
  "shortName": "ktoc",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;