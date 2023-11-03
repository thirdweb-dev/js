import type { Chain } from "../types";
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
  "name": "BeanEco SmartChain",
  "nativeCurrency": {
    "name": "BeanEco SmartChain",
    "symbol": "BESC",
    "decimals": 18
  },
  "networkId": 535037,
  "rpc": [
    "https://beaneco-smartchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://535037.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.bescscan.io"
  ],
  "shortName": "BESC",
  "slug": "beaneco-smartchain",
  "testnet": false,
  "title": "BESC Mainnet"
} as const satisfies Chain;