import type { Chain } from "../src/types";
export default {
  "name": "Teslafunds",
  "chain": "TSF",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Teslafunds Ether",
    "symbol": "TSF",
    "decimals": 18
  },
  "infoURL": "https://teslafunds.io",
  "shortName": "tsf",
  "chainId": 1856,
  "networkId": 1,
  "testnet": false,
  "slug": "teslafunds"
} as const satisfies Chain;