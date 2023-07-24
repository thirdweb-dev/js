import type { Chain } from "../src/types";
export default {
  "name": "Bubs Testnet",
  "chain": "gETH",
  "shortName": "Bubs",
  "chainId": 1582,
  "testnet": true,
  "icon": {
    "format": "svg",
    "url": "ipfs://bafybeibfpls2ealp4e5fdeoxessfjjkldgjnrcx2erph7524pg7alskk6a/1f9cb.svg",
    "width": 512,
    "height": 512
  },
  "rpc": [
    "https://bubs-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://bubs.calderachain.xyz/http"
  ],
  "nativeCurrency": {
    "decimals": 18,
    "name": "Ether",
    "symbol": "gETH"
  },
  "explorers": [
    {
      "url": "https://explorer.bubstestnet.com",
      "name": "Bubs Testnet Explorer",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://bubstestnet.com"
  ],
  "infoURL": "https://bubstestnet.com",
  "networkId": 1582,
  "slug": "bubs-testnet"
} as const satisfies Chain;