import type { Chain } from "../types";
export default {
  "chain": "BIGSB",
  "chainId": 2137,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://bigshortbets.com/",
  "name": "BigShortBets",
  "nativeCurrency": {
    "name": "USD Coin",
    "symbol": "USDC",
    "decimals": 18
  },
  "networkId": 2137,
  "rpc": [
    "https://bigshortbets.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2137.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://market.bigsb.io",
    "wss://market.bigsb.io"
  ],
  "shortName": "bigsb",
  "slug": "bigshortbets",
  "testnet": false
} as const satisfies Chain;