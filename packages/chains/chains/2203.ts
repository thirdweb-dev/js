import type { Chain } from "../src/types";
export default {
  "name": "Bitcoin EVM",
  "chain": "Bitcoin EVM",
  "rpc": [
    "https://bitcoin-evm.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://connect.bitcoinevm.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bitcoin",
    "symbol": "BTC",
    "decimals": 18
  },
  "infoURL": "https://bitcoinevm.com",
  "shortName": "BTC",
  "chainId": 2203,
  "networkId": 2203,
  "icon": "ebtc",
  "explorers": [
    {
      "name": "Explorer",
      "url": "https://explorer.bitcoinevm.com",
      "icon": "ebtc",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "bitcoin-evm"
} as const satisfies Chain;