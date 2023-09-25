import type { Chain } from "../src/types";
export default {
  "chainId": 3125659152,
  "chain": "PIRL",
  "name": "Pirl",
  "rpc": [
    "https://pirl.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://wallrpc.pirl.io"
  ],
  "slug": "pirl",
  "faucets": [],
  "nativeCurrency": {
    "name": "Pirl Ether",
    "symbol": "PIRL",
    "decimals": 18
  },
  "infoURL": "https://pirl.io",
  "shortName": "pirl",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;