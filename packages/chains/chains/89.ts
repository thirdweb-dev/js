import type { Chain } from "../src/types";
export default {
  "chain": "Viction",
  "chainId": 89,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://viction.xyz",
  "name": "Viction Testnet",
  "nativeCurrency": {
    "name": "Viction",
    "symbol": "VIC",
    "decimals": 18
  },
  "networkId": 89,
  "rpc": [
    "https://89.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.viction.xyz"
  ],
  "shortName": "vict",
  "slip44": 1,
  "slug": "viction-testnet",
  "testnet": true
} as const satisfies Chain;