import type { Chain } from "../src/types";
export default {
  "chain": "CLO",
  "chainId": 820,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://callisto.network",
  "name": "Callisto Mainnet",
  "nativeCurrency": {
    "name": "Callisto",
    "symbol": "CLO",
    "decimals": 18
  },
  "networkId": 1,
  "rpc": [
    "https://820.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.callisto.network/"
  ],
  "shortName": "clo",
  "slip44": 820,
  "slug": "callisto",
  "testnet": false
} as const satisfies Chain;