import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 2710,
  "explorers": [
    {
      "name": "Morphism Testnet Explorer",
      "url": "https://explorer-testnet.morphism.xyz",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://morphism.xyz",
  "name": "Morphism Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://morphism-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.morphism.xyz"
  ],
  "shortName": "tmorph",
  "slug": "morphism-testnet",
  "testnet": true
} as const satisfies Chain;