import type { Chain } from "../src/types";
export default {
  "chain": "Energy Web Chain",
  "chainId": 246,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.energyweb.org",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://energyweb.org",
  "name": "Energy Web Chain",
  "nativeCurrency": {
    "name": "Energy Web Token",
    "symbol": "EWT",
    "decimals": 18
  },
  "networkId": 246,
  "rpc": [
    "https://246.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.energyweb.org",
    "wss://rpc.energyweb.org/ws"
  ],
  "shortName": "ewt",
  "slip44": 246,
  "slug": "energy-web-chain",
  "testnet": false
} as const satisfies Chain;