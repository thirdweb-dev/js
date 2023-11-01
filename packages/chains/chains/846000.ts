import type { Chain } from "../src/types";
export default {
  "chain": "4GN",
  "chainId": 846000,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://bloqs4good.com",
  "name": "4GoodNetwork",
  "nativeCurrency": {
    "name": "APTA",
    "symbol": "APTA",
    "decimals": 18
  },
  "networkId": 846000,
  "rpc": [
    "https://4goodnetwork.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://846000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://chain.deptofgood.com"
  ],
  "shortName": "bloqs4good",
  "slug": "4goodnetwork",
  "testnet": false
} as const satisfies Chain;