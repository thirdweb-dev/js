import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 421614,
  "explorers": [
    {
      "name": "Arbitrum Sepolia Rollup Testnet Explorer",
      "url": "https://sepolia-explorer.arbitrum.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://arbitrum.io",
  "name": "Arbitrum Sepolia",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://arbitrum-sepolia.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia-rollup.arbitrum.io/rpc"
  ],
  "shortName": "arb-sep",
  "slug": "arbitrum-sepolia",
  "testnet": true
} as const satisfies Chain;