import type { Chain } from "../src/types";
export default {
  "chainId": 20181205,
  "chain": "QKI",
  "name": "quarkblockchain",
  "rpc": [
    "https://quarkblockchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://hz.rpc.qkiscan.cn",
    "https://jp.rpc.qkiscan.io",
    "https://rpc1.qkiscan.io",
    "https://rpc2.qkiscan.io",
    "https://rpc3.qkiscan.io"
  ],
  "slug": "quarkblockchain",
  "faucets": [],
  "nativeCurrency": {
    "name": "quarkblockchain Native Token",
    "symbol": "QKI",
    "decimals": 18
  },
  "infoURL": "https://quarkblockchain.org/",
  "shortName": "qki",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "qkiscan",
      "url": "https://qkiscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;