import type { Chain } from "../src/types";
export default {
  "chainId": 2021121117,
  "chain": "HOP",
  "name": "DataHopper",
  "rpc": [
    "https://datahopper.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://23.92.21.121:8545"
  ],
  "slug": "datahopper",
  "faucets": [],
  "nativeCurrency": {
    "name": "DataHoppers",
    "symbol": "HOP",
    "decimals": 18
  },
  "infoURL": "https://www.DataHopper.com",
  "shortName": "hop",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;