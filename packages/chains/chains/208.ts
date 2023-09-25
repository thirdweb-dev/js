import type { Chain } from "../src/types";
export default {
  "chainId": 208,
  "chain": "utx",
  "name": "Structx Mainnet",
  "rpc": [
    "https://structx.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.structx.io"
  ],
  "slug": "structx",
  "faucets": [],
  "nativeCurrency": {
    "name": "Notes",
    "symbol": "utx",
    "decimals": 18
  },
  "infoURL": "https://structx.io",
  "shortName": "utx",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;