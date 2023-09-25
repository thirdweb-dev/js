import type { Chain } from "../src/types";
export default {
  "chainId": 2710,
  "chain": "ETH",
  "name": "Morphism Testnet",
  "rpc": [
    "https://morphism-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.morphism.xyz"
  ],
  "slug": "morphism-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://morphism.xyz",
  "shortName": "tmorph",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Morphism Testnet Explorer",
      "url": "https://explorer-testnet.morphism.xyz",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;