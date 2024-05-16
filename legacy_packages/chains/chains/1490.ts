import type { Chain } from "../src/types";
export default {
  "chain": "Vitruveo",
  "chainId": 1490,
  "explorers": [
    {
      "name": "Vitruveo Explorer",
      "url": "https://explorer.vitruveo.xyz",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "infoURL": "https://www.vitruveo.xyz",
  "name": "Vitruveo Mainnet",
  "nativeCurrency": {
    "name": "Vitruveo Coin",
    "symbol": "VTRU",
    "decimals": 18
  },
  "networkId": 1490,
  "rpc": [
    "https://1490.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.vitruveo.xyz"
  ],
  "shortName": "vitruveo",
  "slug": "vitruveo",
  "testnet": false,
  "title": "Vitruveo is a blockchain for Creators"
} as const satisfies Chain;