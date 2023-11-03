import type { Chain } from "../types";
export default {
  "chain": "utx",
  "chainId": 208,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://structx.io",
  "name": "Structx Mainnet",
  "nativeCurrency": {
    "name": "Notes",
    "symbol": "utx",
    "decimals": 18
  },
  "networkId": 208,
  "rpc": [
    "https://structx.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://208.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.structx.io"
  ],
  "shortName": "utx",
  "slug": "structx",
  "testnet": false
} as const satisfies Chain;