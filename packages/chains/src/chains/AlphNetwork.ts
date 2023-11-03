import type { Chain } from "../types";
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
  "infoURL": "https://alph.network",
  "name": "Alph Network",
  "nativeCurrency": {
    "name": "Alph Network",
    "symbol": "ALPH",
    "decimals": 18
  },
  "networkId": 8738,
  "rpc": [
    "https://alph-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://8738.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.alph.network",
    "wss://rpc.alph.network"
  ],
  "shortName": "alph",
  "slug": "alph-network",
  "testnet": false
} as const satisfies Chain;