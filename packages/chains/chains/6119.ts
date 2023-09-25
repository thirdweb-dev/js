import type { Chain } from "../src/types";
export default {
  "chainId": 6119,
  "chain": "UPTN",
  "name": "UPTN",
  "rpc": [
    "https://uptn.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node-api.uptn.io/v1/ext/rpc"
  ],
  "slug": "uptn",
  "icon": {
    "url": "ipfs://Qma6cGPCDcJPFxy5KQaMBrLtuVQiqeLncXVybcBoQuhai5",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "UPTN",
    "symbol": "UPTN",
    "decimals": 18
  },
  "infoURL": "https://uptn.io",
  "shortName": "UPTN",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "UPTN Explorer",
      "url": "https://explorer.uptn.io",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;