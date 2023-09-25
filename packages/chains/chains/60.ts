import type { Chain } from "../src/types";
export default {
  "chainId": 60,
  "chain": "GO",
  "name": "GoChain",
  "rpc": [
    "https://gochain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.gochain.io"
  ],
  "slug": "gochain",
  "faucets": [],
  "nativeCurrency": {
    "name": "GoChain Ether",
    "symbol": "GO",
    "decimals": 18
  },
  "infoURL": "https://gochain.io",
  "shortName": "go",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "GoChain Explorer",
      "url": "https://explorer.gochain.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;