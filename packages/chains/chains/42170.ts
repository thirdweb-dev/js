import type { Chain } from "../src/types";
export default {
  "chainId": 42170,
  "chain": "ETH",
  "name": "Arbitrum Nova",
  "rpc": [
    "https://arbitrum-nova.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://nova.arbitrum.io/rpc",
    "https://arbitrum-nova.publicnode.com",
    "wss://arbitrum-nova.publicnode.com"
  ],
  "slug": "arbitrum-nova",
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://arbitrum.io",
  "shortName": "arb-nova",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Arbitrum Nova Chain Explorer",
      "url": "https://nova-explorer.arbitrum.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;