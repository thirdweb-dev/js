import type { Chain } from "../src/types";
export default {
  "chain": "BESC",
  "chainId": 535037,
  "explorers": [
    {
      "name": "bescscan",
      "url": "https://Bescscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "name": "BeanEco SmartChain",
  "nativeCurrency": {
    "name": "BeanEco SmartChain",
    "symbol": "BESC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://beaneco-smartchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.bescscan.io"
  ],
  "shortName": "BESC",
  "slug": "beaneco-smartchain",
  "testnet": false
} as const satisfies Chain;