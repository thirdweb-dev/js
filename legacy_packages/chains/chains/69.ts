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
  "infoURL": "https://optimism.io",
  "name": "Optimism Kovan",
  "nativeCurrency": {
    "name": "Kovan Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 69,
  "rpc": [
    "https://69.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://kovan.optimism.io/"
  ],
  "shortName": "okov",
  "slip44": 1,
  "slug": "optimism-kovan",
  "testnet": true,
  "title": "Optimism Testnet Kovan"
} as const satisfies Chain;