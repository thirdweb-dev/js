import type { Chain } from "../types";
export default {
  "chain": "Kortho Chain",
  "chainId": 2559,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://www.kortho.io/",
  "name": "Kortho Mainnet",
  "nativeCurrency": {
    "name": "KorthoChain",
    "symbol": "KTO",
    "decimals": 11
  },
  "networkId": 2559,
  "rpc": [
    "https://kortho.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2559.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://www.kortho-chain.com"
  ],
  "shortName": "ktoc",
  "slug": "kortho",
  "testnet": false
} as const satisfies Chain;