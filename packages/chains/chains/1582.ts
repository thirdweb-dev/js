import type { Chain } from "../src/types";
export default {
  "chainId": 1582,
  "chain": "gETH",
  "name": "Bubs Testnet",
  "rpc": [
    "https://bubs-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://bubs.calderachain.xyz/http"
  ],
  "slug": "bubs-testnet",
  "icon": {
    "url": "ipfs://bafybeibfpls2ealp4e5fdeoxessfjjkldgjnrcx2erph7524pg7alskk6a/1f9cb.svg",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "faucets": [
    "https://bubstestnet.com"
  ],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://bubstestnet.com",
  "shortName": "Bubs",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Bubs Testnet Explorer",
      "url": "https://explorer.bubstestnet.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;