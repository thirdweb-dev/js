import type { Chain } from "../src/types";
export default {
  "name": "Structx Mainnet",
  "chain": "utx",
  "rpc": [
    "https://structx.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.structx.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Notes",
    "symbol": "utx",
    "decimals": 18
  },
  "infoURL": "https://structx.io",
  "shortName": "utx",
  "chainId": 208,
  "networkId": 208,
  "testnet": false,
  "slug": "structx"
} as const satisfies Chain;