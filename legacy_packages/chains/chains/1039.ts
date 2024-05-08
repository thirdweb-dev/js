import type { Chain } from "../src/types";
export default {
  "chain": "Bronos",
  "chainId": 1039,
  "explorers": [
    {
      "name": "Bronos Explorer",
      "url": "https://broscan.bronos.org",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://bronos.org",
  "name": "Bronos Mainnet",
  "nativeCurrency": {
    "name": "BRO",
    "symbol": "BRO",
    "decimals": 18
  },
  "networkId": 1039,
  "rpc": [],
  "shortName": "bronos-mainnet",
  "slug": "bronos",
  "testnet": false
} as const satisfies Chain;