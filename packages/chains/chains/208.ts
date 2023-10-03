import type { Chain } from "../src/types";
export default {
  "chain": "utx",
  "chainId": 208,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://structx.io",
  "name": "Structx Mainnet",
  "nativeCurrency": {
    "name": "Notes",
    "symbol": "utx",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://structx.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.structx.io"
  ],
  "shortName": "utx",
  "slug": "structx",
  "testnet": false
} as const satisfies Chain;