import type { Chain } from "../src/types";
export default {
  "chainId": 927,
  "chain": "Yidark",
  "name": "Yidark Chain Mainnet",
  "rpc": [
    "https://yidark-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.yidark.io"
  ],
  "slug": "yidark-chain",
  "icon": {
    "url": "ipfs://QmdbFGqrpiLQGtAeUAyeS2NBvACfgrchEF466ni5q36fuZ",
    "width": 401,
    "height": 401,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Yidark",
    "symbol": "YDK",
    "decimals": 18
  },
  "infoURL": "https://yidarkscan.com",
  "shortName": "ydk",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Yidarkscan",
      "url": "https://yidarkscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;