import type { Chain } from "../src/types";
export default {
  "chain": "SC20",
  "chainId": 11221,
  "explorers": [
    {
      "name": "shinescan",
      "url": "https://shinescan.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://shinechain.tech",
  "name": "Shine Chain",
  "nativeCurrency": {
    "name": "Shine",
    "symbol": "SC20",
    "decimals": 18
  },
  "networkId": 11221,
  "rpc": [
    "https://11221.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.shinescan.io"
  ],
  "shortName": "SC20",
  "slug": "shine-chain",
  "testnet": false
} as const satisfies Chain;