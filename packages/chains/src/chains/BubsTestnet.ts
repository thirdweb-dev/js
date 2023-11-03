import type { Chain } from "../types";
export default {
  "chain": "gETH",
  "chainId": 1582,
  "explorers": [
    {
      "name": "Bubs Testnet Explorer",
      "url": "https://explorer.bubstestnet.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://bubstestnet.com"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://bafybeibfpls2ealp4e5fdeoxessfjjkldgjnrcx2erph7524pg7alskk6a/1f9cb.svg",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "infoURL": "https://bubstestnet.com",
  "name": "Bubs Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "gETH",
    "decimals": 18
  },
  "networkId": 1582,
  "redFlags": [],
  "rpc": [
    "https://bubs-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1582.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://bubs.calderachain.xyz/http"
  ],
  "shortName": "Bubs",
  "slug": "bubs-testnet",
  "testnet": true
} as const satisfies Chain;