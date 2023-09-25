import type { Chain } from "../src/types";
export default {
  "chainId": 1201,
  "chain": "Evanesco Testnet",
  "name": "Evanesco Testnet",
  "rpc": [
    "https://evanesco-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://seed5.evanesco.org:8547"
  ],
  "slug": "evanesco-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "AVIS",
    "symbol": "AVIS",
    "decimals": 18
  },
  "infoURL": "https://evanesco.org/",
  "shortName": "avis",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;