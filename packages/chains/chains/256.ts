import type { Chain } from "../src/types";
export default {
  "name": "Huobi ECO Chain Testnet",
  "chain": "Heco",
  "rpc": [],
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
  "chainId": 256,
  "networkId": 256,
  "testnet": true,
  "slug": "huobi-eco-chain-testnet"
} as const satisfies Chain;