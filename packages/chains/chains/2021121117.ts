import type { Chain } from "../src/types";
export default {
  "name": "DataHopper",
  "chain": "HOP",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "DataHoppers",
    "symbol": "HOP",
    "decimals": 18
  },
  "infoURL": "https://www.DataHopper.com",
  "shortName": "hop",
  "chainId": 2021121117,
  "networkId": 2021121117,
  "testnet": false,
  "slug": "datahopper"
} as const satisfies Chain;