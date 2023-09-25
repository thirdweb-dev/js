import type { Chain } from "../src/types";
export default {
  "chainId": 100009,
  "chain": "VeChain",
  "name": "VeChain",
  "rpc": [],
  "slug": "vechain",
  "faucets": [],
  "nativeCurrency": {
    "name": "VeChain",
    "symbol": "VET",
    "decimals": 18
  },
  "infoURL": "https://vechain.org",
  "shortName": "vechain",
  "testnet": false,
  "redFlags": [],
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
  "features": []
} as const satisfies Chain;