import type { Chain } from "../src/types";
export default {
  "chain": "GO",
  "chainId": 60,
  "explorers": [
    {
      "name": "GoChain Explorer",
      "url": "https://explorer.gochain.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://gochain.io",
  "name": "GoChain",
  "nativeCurrency": {
    "name": "GoChain Ether",
    "symbol": "GO",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://gochain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.gochain.io"
  ],
  "shortName": "go",
  "slug": "gochain",
  "testnet": false
} as const satisfies Chain;