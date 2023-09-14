import type { Chain } from "../src/types";
export default {
  "name": "Yidark Chain Mainnet",
  "chain": "Yidark",
  "icon": {
    "url": "ipfs://QmdbFGqrpiLQGtAeUAyeS2NBvACfgrchEF466ni5q36fuZ",
    "width": 401,
    "height": 401,
    "format": "png"
  },
  "rpc": [
    "https://yidark-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.yidark.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Yidark",
    "symbol": "YDK",
    "decimals": 18
  },
  "infoURL": "https://yidarkscan.com",
  "shortName": "ydk",
  "chainId": 927,
  "networkId": 927,
  "explorers": [
    {
      "name": "Yidarkscan",
      "url": "https://yidarkscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "yidark-chain"
} as const satisfies Chain;