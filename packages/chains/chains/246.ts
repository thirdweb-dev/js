import type { Chain } from "../src/types";
export default {
  "name": "Energy Web Chain",
  "chain": "Energy Web Chain",
  "rpc": [
    "https://energy-web-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.energyweb.org",
    "wss://rpc.energyweb.org/ws"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Energy Web Token",
    "symbol": "EWT",
    "decimals": 18
  },
  "infoURL": "https://energyweb.org",
  "shortName": "ewt",
  "chainId": 246,
  "networkId": 246,
  "slip44": 246,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.energyweb.org",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "energy-web-chain"
} as const satisfies Chain;