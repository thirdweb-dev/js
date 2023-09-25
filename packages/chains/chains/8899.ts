import type { Chain } from "../src/types";
export default {
  "chainId": 8899,
  "chain": "JBC",
  "name": "JIBCHAIN L1",
  "rpc": [
    "https://jibchain-l1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-l1.jibchain.net"
  ],
  "slug": "jibchain-l1",
  "faucets": [],
  "nativeCurrency": {
    "name": "JIBCOIN",
    "symbol": "JBC",
    "decimals": 18
  },
  "infoURL": "https://jibchain.net",
  "shortName": "jbc",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "JIBCHAIN Explorer",
      "url": "https://exp-l1.jibchain.net",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;