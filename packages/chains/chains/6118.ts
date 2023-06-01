import type { Chain } from "../src/types";
export default {
  "name": "UPTN Testnet",
  "chain": "UPTN",
  "icon": {
    "url": "ipfs://Qma6cGPCDcJPFxy5KQaMBrLtuVQiqeLncXVybcBoQuhai5",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "rpc": [
    "https://uptn-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node-api.alp.uptn.io/v1/ext/rpc"
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
  "shortName": "UPTN-TEST",
  "chainId": 6118,
  "networkId": 6118,
  "explorers": [
    {
      "name": "UPTN Testnet Explorer",
      "url": "https://testnet.explorer.uptn.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "uptn-testnet"
} as const satisfies Chain;