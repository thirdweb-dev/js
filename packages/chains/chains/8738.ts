import type { Chain } from "../src/types";
export default {
  "chainId": 8738,
  "chain": "ALPH",
  "name": "Alph Network",
  "rpc": [
    "https://alph-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.alph.network",
    "wss://rpc.alph.network"
  ],
  "slug": "alph-network",
  "faucets": [],
  "nativeCurrency": {
    "name": "Alph Network",
    "symbol": "ALPH",
    "decimals": 18
  },
  "infoURL": "https://alph.network",
  "shortName": "alph",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "alphscan",
      "url": "https://explorer.alph.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;