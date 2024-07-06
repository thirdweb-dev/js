import type { Chain } from "../src/types";
export default {
  "chain": "WAN",
  "chainId": 999,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://testnet.wanscan.org",
  "name": "Wanchain Testnet",
  "nativeCurrency": {
    "name": "Wancoin",
    "symbol": "WAN",
    "decimals": 18
  },
  "networkId": 999,
  "rpc": [
    "https://999.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://gwan-ssl.wandevs.org:46891/"
  ],
  "shortName": "twan",
  "slip44": 1,
  "slug": "wanchain-testnet",
  "testnet": true
} as const satisfies Chain;