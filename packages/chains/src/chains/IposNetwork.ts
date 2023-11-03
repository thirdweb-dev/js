import type { Chain } from "../types";
export default {
  "chain": "IPOS",
  "chainId": 1122334455,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://iposlab.com",
  "name": "IPOS Network",
  "nativeCurrency": {
    "name": "IPOS Network Ether",
    "symbol": "IPOS",
    "decimals": 18
  },
  "networkId": 1122334455,
  "rpc": [
    "https://ipos-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1122334455.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.iposlab.com",
    "https://rpc2.iposlab.com"
  ],
  "shortName": "ipos",
  "slug": "ipos-network",
  "testnet": false
} as const satisfies Chain;