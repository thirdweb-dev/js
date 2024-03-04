import type { Chain } from "../src/types";
export default {
  "chain": "SWAN",
  "chainId": 2024,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://swanchain.io/",
  "name": "Swan Saturn Testnet",
  "nativeCurrency": {
    "name": "SWANETH",
    "symbol": "sETH",
    "decimals": 18
  },
  "networkId": 2024,
  "rpc": [
    "https://2024.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://saturn-rpc.swanchain.io"
  ],
  "shortName": "swan",
  "slug": "swan-saturn-testnet",
  "testnet": true
} as const satisfies Chain;