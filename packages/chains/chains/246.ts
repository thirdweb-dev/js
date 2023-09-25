import type { Chain } from "../src/types";
export default {
  "chainId": 246,
  "chain": "Energy Web Chain",
  "name": "Energy Web Chain",
  "rpc": [
    "https://energy-web-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.energyweb.org",
    "wss://rpc.energyweb.org/ws"
  ],
  "slug": "energy-web-chain",
  "faucets": [],
  "nativeCurrency": {
    "name": "Energy Web Token",
    "symbol": "EWT",
    "decimals": 18
  },
  "infoURL": "https://energyweb.org",
  "shortName": "ewt",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.energyweb.org",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;