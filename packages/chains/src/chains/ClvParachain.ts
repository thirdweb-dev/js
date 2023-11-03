import type { Chain } from "../types";
export default {
  "chain": "CLV",
  "chainId": 1024,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://clv.org",
  "name": "CLV Parachain",
  "nativeCurrency": {
    "name": "CLV",
    "symbol": "CLV",
    "decimals": 18
  },
  "networkId": 1024,
  "rpc": [
    "https://clv-parachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1024.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api-para.clover.finance"
  ],
  "shortName": "clv",
  "slug": "clv-parachain",
  "testnet": false
} as const satisfies Chain;