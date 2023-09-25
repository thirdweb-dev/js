import type { Chain } from "../src/types";
export default {
  "chainId": 8086,
  "chain": "BTE",
  "name": "BitEth",
  "rpc": [
    "https://biteth.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.biteth.org"
  ],
  "slug": "biteth",
  "faucets": [],
  "nativeCurrency": {
    "name": "BitEth",
    "symbol": "BTE",
    "decimals": 18
  },
  "infoURL": "https://biteth.org",
  "shortName": "BitEth",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;