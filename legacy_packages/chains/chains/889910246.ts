import type { Chain } from "../src/types";
export default {
  "chain": "PTCE",
  "chainId": 889910246,
  "explorers": [
    {
      "name": "PTCESCAN Explorer",
      "url": "https://ptcscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://ptcscan.io",
  "name": "PTCESCAN Mainnet",
  "nativeCurrency": {
    "name": "PTCE",
    "symbol": "PTCE",
    "decimals": 18
  },
  "networkId": 889910246,
  "rpc": [
    "https://889910246.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ptcscan.io"
  ],
  "shortName": "POLYTECH",
  "slug": "ptcescan",
  "testnet": false,
  "title": "PTCESCAN Mainnet"
} as const satisfies Chain;