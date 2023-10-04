import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 69,
  "explorers": [
    {
      "name": "etherscan",
      "url": "https://kovan-optimistic.etherscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "http://fauceth.komputing.org?chain=69&address=${ADDRESS}"
  ],
  "features": [],
  "infoURL": "https://optimism.io",
  "name": "Optimism Kovan",
  "nativeCurrency": {
    "name": "Kovan Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://optimism-kovan.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://kovan.optimism.io/"
  ],
  "shortName": "okov",
  "slug": "optimism-kovan",
  "testnet": true
} as const satisfies Chain;