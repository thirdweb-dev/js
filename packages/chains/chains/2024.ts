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
    "symbol": "SWAN",
    "decimals": 18
  },
  "networkId": 2024,
  "rpc": [
    "https://swan-saturn-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2024.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://saturn-rpc.swanchain.io"
  ],
  "shortName": "swan",
  "slug": "swan-saturn-testnet",
  "testnet": true
} as const satisfies Chain;