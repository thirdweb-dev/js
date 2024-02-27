import type { Chain } from "../src/types";
export default {
  "chain": "TOMO",
  "chainId": 88,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://tomochain.com",
  "name": "TomoChain",
  "nativeCurrency": {
    "name": "TomoChain",
    "symbol": "TOMO",
    "decimals": 18
  },
  "networkId": 88,
  "rpc": [
    "https://88.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tomochain.com"
  ],
  "shortName": "tomo",
  "slip44": 889,
  "slug": "tomochain",
  "testnet": false
} as const satisfies Chain;