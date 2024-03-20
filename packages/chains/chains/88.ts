import type { Chain } from "../src/types";
export default {
  "chain": "Viction",
  "chainId": 88,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://viction.xyz",
  "name": "Viction",
  "nativeCurrency": {
    "name": "Viction",
    "symbol": "VIC",
    "decimals": 18
  },
  "networkId": 88,
  "rpc": [
    "https://88.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.viction.xyz"
  ],
  "shortName": "vic",
  "slip44": 889,
  "slug": "viction",
  "testnet": false
} as const satisfies Chain;