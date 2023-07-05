import type { Chain } from "../src/types";
export default {
  "name": "Taro Testnet",
  "chain": "gETH",
  "shortName": "Taro",
  "chainId": 1582,
  "testnet": true,
  "icon": {
    "format": "svg",
    "url": "ipfs://bafybeibfpls2ealp4e5fdeoxessfjjkldgjnrcx2erph7524pg7alskk6a/1f9cb.svg",
    "width": 512,
    "height": 512
  },
  "rpc": [
    "https://taro-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://taro-testnet.calderachain.xyz/http"
  ],
  "nativeCurrency": {
    "decimals": 18,
    "name": "Ether",
    "symbol": "gETH"
  },
  "explorers": [
    {
      "url": "https://explorer.tarotestnet.com",
      "name": "Taro Testnet Explorer",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://tarotestnet.com"
  ],
  "infoURL": "https://tarotestnet.com",
  "networkId": 1582,
  "slug": "taro-testnet"
} as const satisfies Chain;