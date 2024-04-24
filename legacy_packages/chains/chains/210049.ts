import type { Chain } from "../src/types";
export default {
  "chain": "GitAGI",
  "chainId": 210049,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://gitagi.org/",
  "name": "GitAGI Atlas Testnet",
  "nativeCurrency": {
    "name": "GitAGI",
    "symbol": "tGAGI",
    "decimals": 18
  },
  "networkId": 210049,
  "rpc": [
    "https://210049.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.gitagi.org"
  ],
  "shortName": "atlas",
  "slug": "gitagi-atlas-testnet",
  "testnet": true
} as const satisfies Chain;