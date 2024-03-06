import type { Chain } from "../src/types";
export default {
  "chain": "JOYS",
  "chainId": 35855456,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://joys.digital",
  "name": "Joys Digital Mainnet",
  "nativeCurrency": {
    "name": "JOYS",
    "symbol": "JOYS",
    "decimals": 18
  },
  "networkId": 35855456,
  "rpc": [
    "https://35855456.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node.joys.digital"
  ],
  "shortName": "JOYS",
  "slug": "joys-digital",
  "testnet": false
} as const satisfies Chain;