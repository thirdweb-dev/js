import type { Chain } from "../src/types";
export default {
  "chain": "CLO",
  "chainId": 20729,
  "explorers": [],
  "faucets": [
    "https://faucet.callisto.network/"
  ],
  "infoURL": "https://callisto.network",
  "name": "Callisto Testnet",
  "nativeCurrency": {
    "name": "Callisto",
    "symbol": "CLO",
    "decimals": 18
  },
  "networkId": 79,
  "rpc": [
    "https://20729.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.callisto.network/"
  ],
  "shortName": "CLOTestnet",
  "slip44": 1,
  "slug": "callisto-testnet",
  "testnet": true
} as const satisfies Chain;