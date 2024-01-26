import type { Chain } from "../src/types";
export default {
  "chain": "Evanesco Testnet",
  "chainId": 1201,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://evanesco.org/",
  "name": "Evanesco Testnet",
  "nativeCurrency": {
    "name": "AVIS",
    "symbol": "AVIS",
    "decimals": 18
  },
  "networkId": 1201,
  "rpc": [
    "https://evanesco-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1201.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://seed5.evanesco.org:8547"
  ],
  "shortName": "avis",
  "slip44": 1,
  "slug": "evanesco-testnet",
  "testnet": true
} as const satisfies Chain;