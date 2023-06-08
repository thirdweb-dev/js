import type { Chain } from "../src/types";
export default {
  "name": "Patex",
  "chain": "ETH",
  "rpc": [
    "https://patex.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.patex.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://patex.io/",
  "shortName": "peth",
  "chainId": 789,
  "networkId": 789,
  "testnet": false,
  "slug": "patex"
} as const satisfies Chain;