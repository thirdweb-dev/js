import type { Chain } from "../src/types";
export default {
  "chainId": 256,
  "chain": "Heco",
  "name": "Huobi ECO Chain Testnet",
  "rpc": [
    "https://huobi-eco-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://http-testnet.hecochain.com",
    "wss://ws-testnet.hecochain.com"
  ],
  "slug": "huobi-eco-chain-testnet",
  "faucets": [
    "https://scan-testnet.hecochain.com/faucet"
  ],
  "nativeCurrency": {
    "name": "Huobi ECO Chain Test Native Token",
    "symbol": "htt",
    "decimals": 18
  },
  "infoURL": "https://testnet.hecoinfo.com",
  "shortName": "hecot",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;