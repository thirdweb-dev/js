import type { Chain } from "../src/types";
export default {
  "chain": "Oneness-Testnet",
  "chainId": 2141,
  "explorers": [
    {
      "name": "oneness-testnet",
      "url": "https://scan.testnet.onenesslabs.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "name": "Oneness TestNet",
  "nativeCurrency": {
    "name": "BTC",
    "symbol": "BTC",
    "decimals": 18
  },
  "networkId": 2141,
  "rpc": [
    "https://2141.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.onenesslabs.io/"
  ],
  "shortName": "oneness-testnet",
  "slug": "oneness-testnet",
  "testnet": true
} as const satisfies Chain;