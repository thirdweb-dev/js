import type { Chain } from "../src/types";
export default {
  "chainId": 777,
  "chain": "cheapETH",
  "name": "cheapETH",
  "rpc": [
    "https://cheapeth.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node.cheapeth.org/rpc"
  ],
  "slug": "cheapeth",
  "faucets": [],
  "nativeCurrency": {
    "name": "cTH",
    "symbol": "cTH",
    "decimals": 18
  },
  "infoURL": "https://cheapeth.org/",
  "shortName": "cth",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;