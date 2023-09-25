import type { Chain } from "../src/types";
export default {
  "chainId": 421614,
  "chain": "ETH",
  "name": "Arbitrum Sepolia",
  "rpc": [
    "https://arbitrum-sepolia.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia-rollup.arbitrum.io/rpc"
  ],
  "slug": "arbitrum-sepolia",
  "faucets": [],
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://arbitrum.io",
  "shortName": "arb-sep",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Arbitrum Sepolia Rollup Testnet Explorer",
      "url": "https://sepolia-explorer.arbitrum.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;