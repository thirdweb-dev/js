import type { Chain } from "../src/types";
export default {
  "chain": "XERO",
  "chainId": 1313500,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://xerom.org",
  "name": "Xerom",
  "nativeCurrency": {
    "name": "Xerom Ether",
    "symbol": "XERO",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://xerom.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.xerom.org"
  ],
  "shortName": "xero",
  "slug": "xerom",
  "testnet": false
} as const satisfies Chain;