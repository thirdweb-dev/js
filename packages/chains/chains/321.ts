import type { Chain } from "../src/types";
export default {
  "chain": "KCC",
  "chainId": 321,
  "explorers": [
    {
      "name": "KCC Explorer",
      "url": "https://explorer.kcc.io/en",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://kcc.io",
  "name": "KCC Mainnet",
  "nativeCurrency": {
    "name": "KuCoin Token",
    "symbol": "KCS",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://kcc.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet.kcc.network",
    "https://kcc.mytokenpocket.vip",
    "https://public-rpc.blockpi.io/http/kcc"
  ],
  "shortName": "kcs",
  "slug": "kcc",
  "testnet": false
} as const satisfies Chain;