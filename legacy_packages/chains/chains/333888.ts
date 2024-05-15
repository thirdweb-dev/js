import type { Chain } from "../src/types";
export default {
  "chain": "Sparta",
  "chainId": 333888,
  "explorers": [],
  "faucets": [
    "https://faucet.polis.tech"
  ],
  "infoURL": "https://polis.tech",
  "name": "Polis Testnet",
  "nativeCurrency": {
    "name": "tPolis",
    "symbol": "tPOLIS",
    "decimals": 18
  },
  "networkId": 333888,
  "rpc": [
    "https://333888.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sparta-rpc.polis.tech"
  ],
  "shortName": "sparta",
  "slip44": 1,
  "slug": "polis-testnet",
  "testnet": true
} as const satisfies Chain;