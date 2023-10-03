import type { Chain } from "../src/types";
export default {
  "chain": "BTE",
  "chainId": 8086,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://biteth.org",
  "name": "BitEth",
  "nativeCurrency": {
    "name": "BitEth",
    "symbol": "BTE",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://biteth.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.biteth.org"
  ],
  "shortName": "BitEth",
  "slug": "biteth",
  "testnet": false
} as const satisfies Chain;