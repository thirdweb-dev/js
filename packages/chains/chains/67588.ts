import type { Chain } from "../src/types";
export default {
  "chainId": 67588,
  "chain": "COSMIC",
  "name": "Cosmic Chain",
  "rpc": [
    "https://cosmic-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://testnet.cosmicchain.site:3344"
  ],
  "slug": "cosmic-chain",
  "faucets": [],
  "nativeCurrency": {
    "name": "Cosmic Chain",
    "symbol": "COSMIC",
    "decimals": 18
  },
  "infoURL": "https://cosmicchain.site",
  "shortName": "Cosmic",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;