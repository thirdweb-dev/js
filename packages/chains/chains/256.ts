import type { Chain } from "../src/types";
export default {
  "chain": "Heco",
  "chainId": 256,
  "explorers": [],
  "faucets": [
    "https://scan-testnet.hecochain.com/faucet"
  ],
  "infoURL": "https://testnet.hecoinfo.com",
  "name": "Huobi ECO Chain Testnet",
  "nativeCurrency": {
    "name": "Huobi ECO Chain Test Native Token",
    "symbol": "htt",
    "decimals": 18
  },
  "networkId": 256,
  "rpc": [
    "https://huobi-eco-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://256.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://http-testnet.hecochain.com",
    "wss://ws-testnet.hecochain.com"
  ],
  "shortName": "hecot",
  "slug": "huobi-eco-chain-testnet",
  "testnet": true
} as const satisfies Chain;