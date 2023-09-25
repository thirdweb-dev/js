import type { Chain } from "../src/types";
export default {
  "chainId": 2137,
  "chain": "BIGSB",
  "name": "BigShortBets",
  "rpc": [
    "https://bigshortbets.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://market.bigsb.io",
    "wss://market.bigsb.io"
  ],
  "slug": "bigshortbets",
  "faucets": [],
  "nativeCurrency": {
    "name": "USD Coin",
    "symbol": "USDC",
    "decimals": 18
  },
  "infoURL": "https://bigshortbets.com/",
  "shortName": "bigsb",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;