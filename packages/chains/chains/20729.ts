import type { Chain } from "../src/types";
export default {
  "chainId": 20729,
  "chain": "CLO",
  "name": "Callisto Testnet",
  "rpc": [
    "https://callisto-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.callisto.network/"
  ],
  "slug": "callisto-testnet",
  "faucets": [
    "https://faucet.callisto.network/"
  ],
  "nativeCurrency": {
    "name": "Callisto",
    "symbol": "CLO",
    "decimals": 18
  },
  "infoURL": "https://callisto.network",
  "shortName": "CLOTestnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;