export default {
  "name": "EnterChain Mainnet",
  "chain": "ENTER",
  "rpc": [
    "https://enterchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://tapi.entercoin.net/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "EnterCoin",
    "symbol": "ENTER",
    "decimals": 18
  },
  "infoURL": "https://entercoin.net",
  "shortName": "enter",
  "chainId": 1214,
  "networkId": 1214,
  "icon": {
    "url": "ipfs://Qmb2UYVc1MjLPi8vhszWRxqBJYoYkWQVxDJRSmtrgk6j2E",
    "width": 64,
    "height": 64,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Enter Explorer - Expenter",
      "url": "https://explorer.entercoin.net",
      "icon": "enter",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "enterchain"
} as const;