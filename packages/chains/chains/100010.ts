import type { Chain } from "../src/types";
export default {
  "chainId": 100010,
  "chain": "VeChain",
  "name": "VeChain Testnet",
  "rpc": [],
  "slug": "vechain-testnet",
  "faucets": [
    "https://faucet.vecha.in"
  ],
  "nativeCurrency": {
    "name": "VeChain",
    "symbol": "VET",
    "decimals": 18
  },
  "infoURL": "https://vechain.org",
  "shortName": "vechain-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "VeChain Explorer",
      "url": "https://explore-testnet.vechain.org",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;