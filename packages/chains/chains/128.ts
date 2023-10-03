import type { Chain } from "../src/types";
export default {
  "chain": "Heco",
  "chainId": 128,
  "explorers": [
    {
      "name": "hecoinfo",
      "url": "https://hecoinfo.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.hecochain.com",
  "name": "Huobi ECO Chain Mainnet",
  "nativeCurrency": {
    "name": "Huobi ECO Chain Native Token",
    "symbol": "HT",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://huobi-eco-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://http-mainnet.hecochain.com",
    "wss://ws-mainnet.hecochain.com"
  ],
  "shortName": "heco",
  "slug": "huobi-eco-chain",
  "testnet": false
} as const satisfies Chain;