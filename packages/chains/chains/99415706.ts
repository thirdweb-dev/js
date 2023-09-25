import type { Chain } from "../src/types";
export default {
  "chainId": 99415706,
  "chain": "TOYS",
  "name": "Joys Digital TestNet",
  "rpc": [
    "https://joys-digital-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://toys.joys.cash/"
  ],
  "slug": "joys-digital-testnet",
  "faucets": [
    "https://faucet.joys.digital/"
  ],
  "nativeCurrency": {
    "name": "TOYS",
    "symbol": "TOYS",
    "decimals": 18
  },
  "infoURL": "https://joys.digital",
  "shortName": "TOYS",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;