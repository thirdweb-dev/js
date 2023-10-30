import type { Chain } from "../src/types";
export default {
  "chain": "HOP",
  "chainId": 2021121117,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://www.DataHopper.com",
  "name": "DataHopper",
  "nativeCurrency": {
    "name": "DataHoppers",
    "symbol": "HOP",
    "decimals": 18
  },
  "networkId": 2021121117,
  "rpc": [
    "https://datahopper.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2021121117.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://23.92.21.121:8545"
  ],
  "shortName": "hop",
  "slug": "datahopper",
  "testnet": false
} as const satisfies Chain;