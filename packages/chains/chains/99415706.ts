import type { Chain } from "../src/types";
export default {
  "chain": "TOYS",
  "chainId": 99415706,
  "explorers": [],
  "faucets": [
    "https://faucet.joys.digital/"
  ],
  "features": [],
  "infoURL": "https://joys.digital",
  "name": "Joys Digital TestNet",
  "nativeCurrency": {
    "name": "TOYS",
    "symbol": "TOYS",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://joys-digital-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://toys.joys.cash/"
  ],
  "shortName": "TOYS",
  "slug": "joys-digital-testnet",
  "testnet": true
} as const satisfies Chain;