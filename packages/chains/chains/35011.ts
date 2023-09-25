import type { Chain } from "../src/types";
export default {
  "chainId": 35011,
  "chain": "TARO",
  "name": "J2O Taro",
  "rpc": [
    "https://j2o-taro.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.j2o.io"
  ],
  "slug": "j2o-taro",
  "faucets": [],
  "nativeCurrency": {
    "name": "TARO Coin",
    "symbol": "taro",
    "decimals": 18
  },
  "infoURL": "https://j2o.io",
  "shortName": "j2o",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "J2O Taro Explorer",
      "url": "https://exp.j2o.io",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;