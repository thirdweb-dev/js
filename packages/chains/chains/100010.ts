import type { Chain } from "../src/types";
export default {
  "chain": "VeChain",
  "chainId": 100010,
  "explorers": [
    {
      "name": "VeChain Explorer",
      "url": "https://explore-testnet.vechain.org",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet.vecha.in"
  ],
  "features": [],
  "infoURL": "https://vechain.org",
  "name": "VeChain Testnet",
  "nativeCurrency": {
    "name": "VeChain",
    "symbol": "VET",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [],
  "shortName": "vechain-testnet",
  "slug": "vechain-testnet",
  "testnet": true
} as const satisfies Chain;