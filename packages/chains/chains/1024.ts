import type { Chain } from "../src/types";
export default {
  "chain": "CLV",
  "chainId": 1024,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://clv.org",
  "name": "CLV Parachain",
  "nativeCurrency": {
    "name": "CLV",
    "symbol": "CLV",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://clv-parachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api-para.clover.finance"
  ],
  "shortName": "clv",
  "slug": "clv-parachain",
  "testnet": false
} as const satisfies Chain;