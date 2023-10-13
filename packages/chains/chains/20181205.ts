import type { Chain } from "../src/types";
export default {
  "chain": "QKI",
  "chainId": 20181205,
  "explorers": [
    {
      "name": "qkiscan",
      "url": "https://qkiscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://quarkblockchain.org/",
  "name": "quarkblockchain",
  "nativeCurrency": {
    "name": "quarkblockchain Native Token",
    "symbol": "QKI",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://quarkblockchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://hz.rpc.qkiscan.cn",
    "https://jp.rpc.qkiscan.io",
    "https://rpc1.qkiscan.io",
    "https://rpc2.qkiscan.io",
    "https://rpc3.qkiscan.io"
  ],
  "shortName": "qki",
  "slug": "quarkblockchain",
  "testnet": false
} as const satisfies Chain;