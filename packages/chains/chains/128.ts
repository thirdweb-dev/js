import type { Chain } from "../src/types";
export default {
  "chainId": 128,
  "chain": "Heco",
  "name": "Huobi ECO Chain Mainnet",
  "rpc": [
    "https://huobi-eco-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://http-mainnet.hecochain.com",
    "wss://ws-mainnet.hecochain.com"
  ],
  "slug": "huobi-eco-chain",
  "faucets": [],
  "nativeCurrency": {
    "name": "Huobi ECO Chain Native Token",
    "symbol": "HT",
    "decimals": 18
  },
  "infoURL": "https://www.hecochain.com",
  "shortName": "heco",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "hecoinfo",
      "url": "https://hecoinfo.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;