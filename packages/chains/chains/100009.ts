import type { Chain } from "../src/types";
export default {
  "name": "VeChain",
  "chain": "VeChain",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "VeChain",
    "symbol": "VET",
    "decimals": 18
  },
  "infoURL": "https://vechain.org",
  "shortName": "vechain",
  "chainId": 100009,
  "networkId": 100009,
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
  "testnet": false,
  "slug": "vechain"
} as const satisfies Chain;