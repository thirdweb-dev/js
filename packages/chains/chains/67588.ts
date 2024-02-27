import type { Chain } from "../src/types";
export default {
  "chain": "COSMIC",
  "chainId": 67588,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://cosmicchain.site",
  "name": "Cosmic Chain",
  "nativeCurrency": {
    "name": "Cosmic Chain",
    "symbol": "COSMIC",
    "decimals": 18
  },
  "networkId": 3344,
  "rpc": [
    "https://67588.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://testnet.cosmicchain.site:3344"
  ],
  "shortName": "Cosmic",
  "slug": "cosmic-chain",
  "testnet": true
} as const satisfies Chain;