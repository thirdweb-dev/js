import type { Chain } from "../src/types";
export default {
  "chain": "JBC",
  "chainId": 8899,
  "explorers": [
    {
      "name": "JIBCHAIN Explorer",
      "url": "https://exp-l1.jibchain.net",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmWvTUSCcQ17mDiKg3w1X5nW3q4wZGuVsZ9vwzJ8S9oCns",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "infoURL": "https://jibchain.net",
  "name": "JIBCHAIN L1",
  "nativeCurrency": {
    "name": "JIBCOIN",
    "symbol": "JBC",
    "decimals": 18
  },
  "networkId": 8899,
  "rpc": [
    "https://8899.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-l1.jibchain.net",
    "https://jib-rpc.inan.in.th"
  ],
  "shortName": "jbc",
  "slug": "jibchain-l1",
  "testnet": false
} as const satisfies Chain;