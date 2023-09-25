import type { Chain } from "../src/types";
export default {
  "chainId": 35855456,
  "chain": "JOYS",
  "name": "Joys Digital Mainnet",
  "rpc": [
    "https://joys-digital.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node.joys.digital"
  ],
  "slug": "joys-digital",
  "faucets": [],
  "nativeCurrency": {
    "name": "JOYS",
    "symbol": "JOYS",
    "decimals": 18
  },
  "infoURL": "https://joys.digital",
  "shortName": "JOYS",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;