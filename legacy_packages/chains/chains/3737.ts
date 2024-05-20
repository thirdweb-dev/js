import type { Chain } from "../src/types";
export default {
  "chain": "Crossbell",
  "chainId": 3737,
  "explorers": [
    {
      "name": "Crossbell Explorer",
      "url": "https://scan.crossbell.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.crossbell.io"
  ],
  "infoURL": "https://crossbell.io",
  "name": "Crossbell",
  "nativeCurrency": {
    "name": "Crossbell Token",
    "symbol": "CSB",
    "decimals": 18
  },
  "networkId": 3737,
  "rpc": [
    "https://3737.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.crossbell.io"
  ],
  "shortName": "csb",
  "slug": "crossbell",
  "testnet": false
} as const satisfies Chain;