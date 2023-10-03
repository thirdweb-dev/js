import type { Chain } from "../src/types";
export default {
  "chain": "ALPH",
  "chainId": 8738,
  "explorers": [
    {
      "name": "alphscan",
      "url": "https://explorer.alph.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://alph.network",
  "name": "Alph Network",
  "nativeCurrency": {
    "name": "Alph Network",
    "symbol": "ALPH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://alph-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.alph.network",
    "wss://rpc.alph.network"
  ],
  "shortName": "alph",
  "slug": "alph-network",
  "testnet": false
} as const satisfies Chain;