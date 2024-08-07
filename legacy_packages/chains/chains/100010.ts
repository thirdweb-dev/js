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
  "infoURL": "https://vechain.org",
  "name": "VeChain Testnet",
  "nativeCurrency": {
    "name": "VeChain",
    "symbol": "VET",
    "decimals": 18
  },
  "networkId": 100010,
  "rpc": [
    "https://100010.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.vechain.energy"
  ],
  "shortName": "vechain-testnet",
  "slip44": 1,
  "slug": "vechain-testnet",
  "testnet": true
} as const satisfies Chain;