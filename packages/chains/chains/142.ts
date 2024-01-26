import type { Chain } from "../src/types";
export default {
  "chain": "DAX",
  "chainId": 142,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://prodax.io/",
  "name": "DAX CHAIN",
  "nativeCurrency": {
    "name": "Prodax",
    "symbol": "DAX",
    "decimals": 18
  },
  "networkId": 142,
  "rpc": [
    "https://dax-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://142.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.prodax.io"
  ],
  "shortName": "dax",
  "slug": "dax-chain",
  "testnet": false
} as const satisfies Chain;