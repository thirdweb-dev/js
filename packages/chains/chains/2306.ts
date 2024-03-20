import type { Chain } from "../src/types";
export default {
  "chain": "ebro",
  "chainId": 2306,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://www.ebrochain.com",
  "name": "Ebro Network",
  "nativeCurrency": {
    "name": "Ebro",
    "symbol": "ebro",
    "decimals": 18
  },
  "networkId": 2306,
  "rpc": [
    "https://2306.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://greendinoswap.com"
  ],
  "shortName": "ebro",
  "slug": "ebro-network",
  "testnet": false
} as const satisfies Chain;