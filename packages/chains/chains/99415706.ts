import type { Chain } from "../src/types";
export default {
  "chain": "TOYS",
  "chainId": 99415706,
  "explorers": [],
  "faucets": [
    "https://faucet.joys.digital/"
  ],
  "infoURL": "https://joys.digital",
  "name": "Joys Digital TestNet",
  "nativeCurrency": {
    "name": "TOYS",
    "symbol": "TOYS",
    "decimals": 18
  },
  "networkId": 99415706,
  "rpc": [
    "https://99415706.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://toys.joys.cash/"
  ],
  "shortName": "TOYS",
  "slip44": 1,
  "slug": "joys-digital-testnet",
  "testnet": true
} as const satisfies Chain;