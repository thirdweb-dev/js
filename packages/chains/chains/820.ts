import type { Chain } from "../src/types";
export default {
  "chain": "CLO",
  "chainId": 820,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://callisto.network",
  "name": "Callisto Mainnet",
  "nativeCurrency": {
    "name": "Callisto",
    "symbol": "CLO",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://callisto.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.callisto.network/"
  ],
  "shortName": "clo",
  "slug": "callisto",
  "testnet": false
} as const satisfies Chain;