import type { Chain } from "../src/types";
export default {
  "name": "Cosmic Chain",
  "chain": "COSMIC",
  "rpc": [
    "https://cosmic-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://testnet.cosmicchain.site:3344"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Cosmic Chain",
    "symbol": "COSMIC",
    "decimals": 18
  },
  "infoURL": "https://cosmicchain.site",
  "shortName": "Cosmic",
  "chainId": 67588,
  "networkId": 3344,
  "testnet": true,
  "slug": "cosmic-chain"
} as const satisfies Chain;