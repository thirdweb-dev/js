import type { Chain } from "../types";
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
  "infoURL": "https://vechain.org",
  "name": "VeChain Testnet",
  "nativeCurrency": {
    "name": "VeChain",
    "symbol": "VET",
    "decimals": 18
  },
  "networkId": 100010,
  "rpc": [],
  "shortName": "vechain-testnet",
  "slug": "vechain-testnet",
  "testnet": true
} as const satisfies Chain;