import type { Chain } from "../src/types";
export default {
  "chainId": 88,
  "chain": "TOMO",
  "name": "TomoChain",
  "rpc": [
    "https://tomochain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tomochain.com"
  ],
  "slug": "tomochain",
  "faucets": [],
  "nativeCurrency": {
    "name": "TomoChain",
    "symbol": "TOMO",
    "decimals": 18
  },
  "infoURL": "https://tomochain.com",
  "shortName": "tomo",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;