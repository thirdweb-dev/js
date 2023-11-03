import type { Chain } from "../types";
export default {
  "chain": "UPTN",
  "chainId": 6119,
  "explorers": [
    {
      "name": "UPTN Explorer",
      "url": "https://explorer.uptn.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://Qma6cGPCDcJPFxy5KQaMBrLtuVQiqeLncXVybcBoQuhai5",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "infoURL": "https://uptn.io",
  "name": "UPTN",
  "nativeCurrency": {
    "name": "UPTN",
    "symbol": "UPTN",
    "decimals": 18
  },
  "networkId": 6119,
  "rpc": [
    "https://uptn.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://6119.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node-api.uptn.io/v1/ext/rpc"
  ],
  "shortName": "UPTN",
  "slug": "uptn",
  "testnet": false
} as const satisfies Chain;