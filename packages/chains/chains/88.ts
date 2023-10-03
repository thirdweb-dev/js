import type { Chain } from "../src/types";
export default {
  "chain": "TOMO",
  "chainId": 88,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://tomochain.com",
  "name": "TomoChain",
  "nativeCurrency": {
    "name": "TomoChain",
    "symbol": "TOMO",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://tomochain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tomochain.com"
  ],
  "shortName": "tomo",
  "slug": "tomochain",
  "testnet": false
} as const satisfies Chain;