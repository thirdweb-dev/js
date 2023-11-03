import type { Chain } from "../types";
export default {
  "chain": "TSF",
  "chainId": 1856,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://teslafunds.io",
  "name": "Teslafunds",
  "nativeCurrency": {
    "name": "Teslafunds Ether",
    "symbol": "TSF",
    "decimals": 18
  },
  "networkId": 1,
  "rpc": [
    "https://teslafunds.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1856.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://tsfapi.europool.me"
  ],
  "shortName": "tsf",
  "slug": "teslafunds",
  "testnet": false
} as const satisfies Chain;