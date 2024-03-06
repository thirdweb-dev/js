import type { Chain } from "../src/types";
export default {
  "chain": "BTC",
  "chainId": 8086,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://biteth.org",
  "name": "Bitcoin Chain",
  "nativeCurrency": {
    "name": "Bitcoin",
    "symbol": "BTC",
    "decimals": 18
  },
  "networkId": 8086,
  "rpc": [
    "https://8086.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.biteth.org"
  ],
  "shortName": "Bitcoin",
  "slug": "bitcoin-chain",
  "testnet": false
} as const satisfies Chain;