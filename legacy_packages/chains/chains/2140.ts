import type { Chain } from "../src/types";
export default {
  "chain": "Oneness",
  "chainId": 2140,
  "explorers": [
    {
      "name": "oneness-mainnet",
      "url": "https://scan.onenesslabs.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "name": "Oneness Network",
  "nativeCurrency": {
    "name": "BTC",
    "symbol": "BTC",
    "decimals": 18
  },
  "networkId": 2140,
  "rpc": [
    "https://2140.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.onenesslabs.io/"
  ],
  "shortName": "oneness",
  "slug": "oneness-network",
  "testnet": false
} as const satisfies Chain;