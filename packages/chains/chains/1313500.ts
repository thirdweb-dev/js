import type { Chain } from "../src/types";
export default {
  "chainId": 1313500,
  "chain": "XERO",
  "name": "Xerom",
  "rpc": [
    "https://xerom.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.xerom.org"
  ],
  "slug": "xerom",
  "faucets": [],
  "nativeCurrency": {
    "name": "Xerom Ether",
    "symbol": "XERO",
    "decimals": 18
  },
  "infoURL": "https://xerom.org",
  "shortName": "xero",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;