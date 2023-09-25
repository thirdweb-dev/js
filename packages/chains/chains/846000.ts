import type { Chain } from "../src/types";
export default {
  "chainId": 846000,
  "chain": "4GN",
  "name": "4GoodNetwork",
  "rpc": [
    "https://4goodnetwork.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://chain.deptofgood.com"
  ],
  "slug": "4goodnetwork",
  "faucets": [],
  "nativeCurrency": {
    "name": "APTA",
    "symbol": "APTA",
    "decimals": 18
  },
  "infoURL": "https://bloqs4good.com",
  "shortName": "bloqs4good",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;