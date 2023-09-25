import type { Chain } from "../src/types";
export default {
  "chainId": 69,
  "chain": "ETH",
  "name": "Optimism Kovan",
  "rpc": [
    "https://optimism-kovan.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://kovan.optimism.io/"
  ],
  "slug": "optimism-kovan",
  "faucets": [
    "http://fauceth.komputing.org?chain=69&address=${ADDRESS}"
  ],
  "nativeCurrency": {
    "name": "Kovan Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://optimism.io",
  "shortName": "okov",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "etherscan",
      "url": "https://kovan-optimistic.etherscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;