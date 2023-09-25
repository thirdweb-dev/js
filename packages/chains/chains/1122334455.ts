import type { Chain } from "../src/types";
export default {
  "chainId": 1122334455,
  "chain": "IPOS",
  "name": "IPOS Network",
  "rpc": [
    "https://ipos-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.iposlab.com",
    "https://rpc2.iposlab.com"
  ],
  "slug": "ipos-network",
  "faucets": [],
  "nativeCurrency": {
    "name": "IPOS Network Ether",
    "symbol": "IPOS",
    "decimals": 18
  },
  "infoURL": "https://iposlab.com",
  "shortName": "ipos",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;