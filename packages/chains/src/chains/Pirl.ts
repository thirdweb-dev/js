import type { Chain } from "../types";
export default {
  "chain": "PIRL",
  "chainId": 3125659152,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://pirl.io",
  "name": "Pirl",
  "nativeCurrency": {
    "name": "Pirl Ether",
    "symbol": "PIRL",
    "decimals": 18
  },
  "networkId": 3125659152,
  "rpc": [
    "https://pirl.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://3125659152.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://wallrpc.pirl.io"
  ],
  "shortName": "pirl",
  "slip44": 164,
  "slug": "pirl",
  "testnet": false
} as const satisfies Chain;