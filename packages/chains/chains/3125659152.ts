import type { Chain } from "../src/types";
export default {
  "chain": "PIRL",
  "chainId": 3125659152,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://pirl.io",
  "name": "Pirl",
  "nativeCurrency": {
    "name": "Pirl Ether",
    "symbol": "PIRL",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://pirl.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://wallrpc.pirl.io"
  ],
  "shortName": "pirl",
  "slug": "pirl",
  "testnet": false
} as const satisfies Chain;