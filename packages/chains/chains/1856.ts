import type { Chain } from "../src/types";
export default {
  "chainId": 1856,
  "chain": "TSF",
  "name": "Teslafunds",
  "rpc": [
    "https://teslafunds.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://tsfapi.europool.me"
  ],
  "slug": "teslafunds",
  "faucets": [],
  "nativeCurrency": {
    "name": "Teslafunds Ether",
    "symbol": "TSF",
    "decimals": 18
  },
  "infoURL": "https://teslafunds.io",
  "shortName": "tsf",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;