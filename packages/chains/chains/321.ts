import type { Chain } from "../src/types";
export default {
  "chainId": 321,
  "chain": "KCC",
  "name": "KCC Mainnet",
  "rpc": [
    "https://kcc.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet.kcc.network",
    "https://kcc.mytokenpocket.vip",
    "https://public-rpc.blockpi.io/http/kcc"
  ],
  "slug": "kcc",
  "faucets": [],
  "nativeCurrency": {
    "name": "KuCoin Token",
    "symbol": "KCS",
    "decimals": 18
  },
  "infoURL": "https://kcc.io",
  "shortName": "kcs",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "KCC Explorer",
      "url": "https://explorer.kcc.io/en",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;