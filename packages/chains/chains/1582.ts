import type { Chain } from "../src/types";
export default {
  "name": "Taro Testnet",
  "chain": "gETH",
  "icon": {
    "url": "ipfs://bafybeibfpls2ealp4e5fdeoxessfjjkldgjnrcx2erph7524pg7alskk6a/1f9cb.svg",
    "height": 512,
    "width": 512,
    "format": "svg"
  },
  "rpc": [
    "https://taro-testnet.calderachain.xyz/http"
  ],
  "faucets": [
    "https://tarotestnet.com"
  ],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "gETH",
    "decimals": 18
  },
  "infoURL": "https://tarotestnet.com",
  "shortName": "Taro",
  "chainId": 1582,
  "networkId": 1582,
  "explorers": [
    {
      "name": "Taro Testnet Explorer",
      "url": "https://explorer.tarotestnet.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "taro-testnet"
} as const satisfies Chain;