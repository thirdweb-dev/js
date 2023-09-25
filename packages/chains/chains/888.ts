import type { Chain } from "../src/types";
export default {
  "chainId": 888,
  "chain": "WAN",
  "name": "Wanchain",
  "rpc": [
    "https://wanchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://gwan-ssl.wandevs.org:56891/"
  ],
  "slug": "wanchain",
  "faucets": [],
  "nativeCurrency": {
    "name": "Wancoin",
    "symbol": "WAN",
    "decimals": 18
  },
  "infoURL": "https://www.wanscan.org",
  "shortName": "wan",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;