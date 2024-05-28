import type { Chain } from "../src/types";
export default {
  "chain": "Bitcoin EVM",
  "chainId": 2203,
  "explorers": [
    {
      "name": "Explorer",
      "url": "https://explorer.bitcoinevm.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://bitcoinevm.com",
  "name": "Bitcoin EVM",
  "nativeCurrency": {
    "name": "Bitcoin",
    "symbol": "BTC",
    "decimals": 18
  },
  "networkId": 2203,
  "rpc": [
    "https://2203.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://connect.bitcoinevm.com"
  ],
  "shortName": "BTC",
  "slug": "bitcoin-evm",
  "testnet": false
} as const satisfies Chain;