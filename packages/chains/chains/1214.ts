import type { Chain } from "../src/types";
export default {
  "chainId": 1214,
  "chain": "ENTER",
  "name": "EnterChain Mainnet",
  "rpc": [
    "https://enterchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://tapi.entercoin.net/"
  ],
  "slug": "enterchain",
  "icon": {
    "url": "ipfs://Qmb2UYVc1MjLPi8vhszWRxqBJYoYkWQVxDJRSmtrgk6j2E",
    "width": 64,
    "height": 64,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "EnterCoin",
    "symbol": "ENTER",
    "decimals": 18
  },
  "infoURL": "https://entercoin.net",
  "shortName": "enter",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Enter Explorer - Expenter",
      "url": "https://explorer.entercoin.net",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;