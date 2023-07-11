import type { Chain } from "../src/types";
export default {
  "name": "UPTN",
  "chain": "UPTN",
  "icon": {
    "url": "ipfs://Qma6cGPCDcJPFxy5KQaMBrLtuVQiqeLncXVybcBoQuhai5",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "rpc": [
    "https://uptn.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node-api.uptn.io/v1/ext/rpc"
  ],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "UPTN",
    "symbol": "UPTN",
    "decimals": 18
  },
  "infoURL": "https://uptn.io",
  "shortName": "UPTN",
  "chainId": 6119,
  "networkId": 6119,
  "explorers": [
    {
      "name": "UPTN Explorer",
      "url": "https://explorer.uptn.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "uptn"
} as const satisfies Chain;