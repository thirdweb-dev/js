import type { Chain } from "../src/types";
export default {
  "name": "GoChain",
  "chain": "GO",
  "rpc": [
    "https://gochain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.gochain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "GoChain Ether",
    "symbol": "GO",
    "decimals": 18
  },
  "infoURL": "https://gochain.io",
  "shortName": "go",
  "chainId": 60,
  "networkId": 60,
  "slip44": 6060,
  "explorers": [
    {
      "name": "GoChain Explorer",
      "url": "https://explorer.gochain.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "gochain"
} as const satisfies Chain;