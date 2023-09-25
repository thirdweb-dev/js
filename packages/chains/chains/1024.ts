import type { Chain } from "../src/types";
export default {
  "chainId": 1024,
  "chain": "CLV",
  "name": "CLV Parachain",
  "rpc": [
    "https://clv-parachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api-para.clover.finance"
  ],
  "slug": "clv-parachain",
  "faucets": [],
  "nativeCurrency": {
    "name": "CLV",
    "symbol": "CLV",
    "decimals": 18
  },
  "infoURL": "https://clv.org",
  "shortName": "clv",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;