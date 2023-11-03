import type { Chain } from "../types";
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
    "https://callisto-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://20729.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.callisto.network/"
  ],
  "shortName": "CLOTestnet",
  "slug": "callisto-testnet",
  "testnet": true
} as const satisfies Chain;