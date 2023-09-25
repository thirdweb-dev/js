import type { Chain } from "../src/types";
export default {
  "chainId": 142,
  "chain": "DAX",
  "name": "DAX CHAIN",
  "rpc": [
    "https://dax-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.prodax.io"
  ],
  "slug": "dax-chain",
  "faucets": [],
  "nativeCurrency": {
    "name": "Prodax",
    "symbol": "DAX",
    "decimals": 18
  },
  "infoURL": "https://prodax.io/",
  "shortName": "dax",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;