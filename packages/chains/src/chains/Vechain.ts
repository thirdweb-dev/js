import type { Chain } from "../types";
export default {
  "chain": "VeChain",
  "chainId": 100009,
  "explorers": [
    {
      "name": "VeChain Stats",
      "url": "https://vechainstats.com",
      "standard": "none"
    },
    {
      "name": "VeChain Explorer",
      "url": "https://explore.vechain.org",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://vechain.org",
  "name": "VeChain",
  "nativeCurrency": {
    "name": "VeChain",
    "symbol": "VET",
    "decimals": 18
  },
  "networkId": 100009,
  "rpc": [],
  "shortName": "vechain",
  "slug": "vechain",
  "testnet": false
} as const satisfies Chain;