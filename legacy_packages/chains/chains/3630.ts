import type { Chain } from "../src/types";
export default {
  "chain": "TYCON",
  "chainId": 3630,
  "explorers": [],
  "faucets": [],
  "name": "Tycooncoin",
  "nativeCurrency": {
    "name": "Tycooncoin",
    "symbol": "TYCO",
    "decimals": 18
  },
  "networkId": 3630,
  "rpc": [
    "https://3630.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.tycoscan.com"
  ],
  "shortName": "TYCON",
  "slug": "tycooncoin",
  "testnet": false
} as const satisfies Chain;