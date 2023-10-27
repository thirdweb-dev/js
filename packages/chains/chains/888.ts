import type { Chain } from "../src/types";
export default {
  "chain": "WAN",
  "chainId": 888,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://www.wanscan.org",
  "name": "Wanchain",
  "nativeCurrency": {
    "name": "Wancoin",
    "symbol": "WAN",
    "decimals": 18
  },
  "networkId": 888,
  "rpc": [
    "https://wanchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://888.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://gwan-ssl.wandevs.org:56891/"
  ],
  "shortName": "wan",
  "slip44": 5718350,
  "slug": "wanchain",
  "testnet": false
} as const satisfies Chain;