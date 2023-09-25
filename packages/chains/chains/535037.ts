import type { Chain } from "../src/types";
export default {
  "chainId": 535037,
  "chain": "BESC",
  "name": "BeanEco SmartChain",
  "rpc": [
    "https://beaneco-smartchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.bescscan.io"
  ],
  "slug": "beaneco-smartchain",
  "faucets": [],
  "nativeCurrency": {
    "name": "BeanEco SmartChain",
    "symbol": "BESC",
    "decimals": 18
  },
  "shortName": "BESC",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "bescscan",
      "url": "https://Bescscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;