import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 42170,
  "explorers": [
    {
      "name": "Arbitrum Nova Chain Explorer",
      "url": "https://nova-explorer.arbitrum.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://arbitrum.io",
  "name": "Arbitrum Nova",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://arbitrum-nova.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nova.arbitrum.io/rpc",
    "https://arbitrum-nova.publicnode.com",
    "wss://arbitrum-nova.publicnode.com"
  ],
  "shortName": "arb-nova",
  "slug": "arbitrum-nova",
  "testnet": false
} as const satisfies Chain;