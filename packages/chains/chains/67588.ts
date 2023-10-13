import type { Chain } from "../src/types";
export default {
  "chain": "COSMIC",
  "chainId": 67588,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://cosmicchain.site",
  "name": "Cosmic Chain",
  "nativeCurrency": {
    "name": "Cosmic Chain",
    "symbol": "COSMIC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://cosmic-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://testnet.cosmicchain.site:3344"
  ],
  "shortName": "Cosmic",
  "slug": "cosmic-chain",
  "testnet": true
} as const satisfies Chain;