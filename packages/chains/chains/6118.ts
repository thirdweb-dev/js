import type { Chain } from "../src/types";
export default {
  "chain": "UPTN",
  "chainId": 6118,
  "explorers": [
    {
      "name": "UPTN Testnet Explorer",
      "url": "https://testnet.explorer.uptn.io",
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
  "name": "UPTN Testnet",
  "nativeCurrency": {
    "name": "UPTN",
    "symbol": "UPTN",
    "decimals": 18
  },
  "networkId": 6118,
  "rpc": [
    "https://uptn-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://6118.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node-api.alp.uptn.io/v1/ext/rpc"
  ],
  "shortName": "UPTN-TEST",
  "slug": "uptn-testnet",
  "testnet": true
} as const satisfies Chain;