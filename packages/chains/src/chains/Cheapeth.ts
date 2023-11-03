import type { Chain } from "../types";
export default {
  "chain": "cheapETH",
  "chainId": 777,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://cheapeth.org/",
  "name": "cheapETH",
  "nativeCurrency": {
    "name": "cTH",
    "symbol": "cTH",
    "decimals": 18
  },
  "networkId": 777,
  "rpc": [
    "https://cheapeth.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://777.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node.cheapeth.org/rpc"
  ],
  "shortName": "cth",
  "slug": "cheapeth",
  "testnet": false
} as const satisfies Chain;