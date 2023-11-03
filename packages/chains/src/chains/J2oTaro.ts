import type { Chain } from "../types";
export default {
  "chain": "TARO",
  "chainId": 35011,
  "explorers": [
    {
      "name": "J2O Taro Explorer",
      "url": "https://exp.j2o.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmdUYi8fjnvdM9iFQ7dwE2YvmhDtavSB3bKhCD2GhPxPks",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://j2o.io",
  "name": "J2O Taro",
  "nativeCurrency": {
    "name": "TARO Coin",
    "symbol": "taro",
    "decimals": 18
  },
  "networkId": 35011,
  "rpc": [
    "https://j2o-taro.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://35011.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.j2o.io"
  ],
  "shortName": "j2o",
  "slug": "j2o-taro",
  "testnet": false
} as const satisfies Chain;