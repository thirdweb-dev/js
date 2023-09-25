import type { Chain } from "../src/types";
export default {
  "chainId": 820,
  "chain": "CLO",
  "name": "Callisto Mainnet",
  "rpc": [
    "https://callisto.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.callisto.network/"
  ],
  "slug": "callisto",
  "faucets": [],
  "nativeCurrency": {
    "name": "Callisto",
    "symbol": "CLO",
    "decimals": 18
  },
  "infoURL": "https://callisto.network",
  "shortName": "clo",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;