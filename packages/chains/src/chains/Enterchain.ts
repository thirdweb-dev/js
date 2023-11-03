import type { Chain } from "../types";
export default {
  "chain": "ENTER",
  "chainId": 1214,
  "explorers": [
    {
      "name": "Enter Explorer - Expenter",
      "url": "https://explorer.entercoin.net",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://Qmb2UYVc1MjLPi8vhszWRxqBJYoYkWQVxDJRSmtrgk6j2E",
        "width": 64,
        "height": 64,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://Qmb2UYVc1MjLPi8vhszWRxqBJYoYkWQVxDJRSmtrgk6j2E",
    "width": 64,
    "height": 64,
    "format": "png"
  },
  "infoURL": "https://entercoin.net",
  "name": "EnterChain Mainnet",
  "nativeCurrency": {
    "name": "EnterCoin",
    "symbol": "ENTER",
    "decimals": 18
  },
  "networkId": 1214,
  "rpc": [
    "https://enterchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1214.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://tapi.entercoin.net/"
  ],
  "shortName": "enter",
  "slug": "enterchain",
  "testnet": false
} as const satisfies Chain;