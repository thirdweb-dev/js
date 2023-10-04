import type { Chain } from "../src/types";
export default {
  "chain": "CLO",
  "chainId": 20729,
  "explorers": [],
  "faucets": [
    "https://faucet.callisto.network/"
  ],
  "features": [],
  "infoURL": "https://callisto.network",
  "name": "Callisto Testnet",
  "nativeCurrency": {
    "name": "Callisto",
    "symbol": "CLO",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://callisto-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.callisto.network/"
  ],
  "shortName": "CLOTestnet",
  "slug": "callisto-testnet",
  "testnet": true
} as const satisfies Chain;