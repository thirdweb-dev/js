export default {
  "name": "J2O Taro",
  "chain": "TARO",
  "rpc": [
    "https://j2o-taro.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.j2o.io"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TARO Coin",
    "symbol": "taro",
    "decimals": 18
  },
  "infoURL": "https://j2o.io",
  "shortName": "j2o",
  "chainId": 35011,
  "networkId": 35011,
  "explorers": [
    {
      "name": "J2O Taro Explorer",
      "url": "https://exp.j2o.io",
      "icon": "j2otaro",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "j2o-taro"
} as const;