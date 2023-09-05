import type { Chain } from "../src/types";
export default {
  "name": "BigShortBets",
  "chain": "BIGSB",
  "rpc": [
    "https://bigshortbets.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://market.bigsb.io",
    "wss://market.bigsb.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "USD Coin",
    "symbol": "USDC",
    "decimals": 18
  },
  "infoURL": "https://bigshortbets.com/",
  "shortName": "bigsb",
  "chainId": 2137,
  "networkId": 2137,
  "explorers": [],
  "testnet": false,
  "slug": "bigshortbets"
} as const satisfies Chain;