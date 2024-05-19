import type { Chain } from "../src/types";
export default {
  "chain": "Vitruveo",
  "chainId": 14333,
  "explorers": [
    {
      "name": "Vitruveo Testnet Explorer",
      "url": "https://test-explorer.vitruveo.xyz",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.vitruveo.xyz"
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "infoURL": "https://www.vitruveo.xyz",
  "name": "Vitruveo Testnet",
  "nativeCurrency": {
    "name": "Vitruveo Test Coin",
    "symbol": "tVTRU",
    "decimals": 18
  },
  "networkId": 14333,
  "rpc": [
    "https://14333.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test-rpc.vitruveo.xyz"
  ],
  "shortName": "vitruveo-test",
  "slug": "vitruveo-testnet",
  "testnet": true,
  "title": "Vitruveo is a blockchain for Creators"
} as const satisfies Chain;