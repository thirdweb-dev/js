import type { Chain } from "../src/types";
export default {
  "chain": "WAN",
  "chainId": 888,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.wanscan.org",
  "name": "Wanchain",
  "nativeCurrency": {
    "name": "Wancoin",
    "symbol": "WAN",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://wanchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://gwan-ssl.wandevs.org:56891/"
  ],
  "shortName": "wan",
  "slug": "wanchain",
  "testnet": false
} as const satisfies Chain;