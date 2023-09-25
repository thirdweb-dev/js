import type { Chain } from "../src/types";
export default {
  "chainId": 6118,
  "chain": "UPTN",
  "name": "UPTN Testnet",
  "rpc": [
    "https://uptn-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node-api.alp.uptn.io/v1/ext/rpc"
  ],
  "slug": "uptn-testnet",
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
  "shortName": "UPTN-TEST",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "UPTN Testnet Explorer",
      "url": "https://testnet.explorer.uptn.io",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;