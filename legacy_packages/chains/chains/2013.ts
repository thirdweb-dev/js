import type { Chain } from "../src/types";
export default {
  "chain": "Panarchy",
  "chainId": 2013,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://polytopia.org/",
  "name": "Panarchy",
  "nativeCurrency": {
    "name": "GAS",
    "symbol": "GAS",
    "decimals": 18
  },
  "networkId": 1,
  "rpc": [
    "https://2013.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://polytopia.org:8545"
  ],
  "shortName": "panarchy",
  "slug": "panarchy",
  "testnet": false
} as const satisfies Chain;