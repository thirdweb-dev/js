import type { Chain } from "../src/types";
export default {
  "name": "Arbitrum Sepolia",
  "title": "Arbitrum Sepolia Rollup Testnet",
  "chain": "ETH",
  "rpc": [
    "https://arbitrum-sepolia.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia-rollup.arbitrum.io/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://arbitrum.io",
  "shortName": "arb-sep",
  "chainId": 421614,
  "networkId": 421614,
  "explorers": [
    {
      "name": "Arbitrum Sepolia Rollup Testnet Explorer",
      "url": "https://sepolia-explorer.arbitrum.io",
      "standard": "EIP3091"
    }
  ],
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://bridge.arbitrum.io"
      }
    ]
  },
  "testnet": true,
  "slug": "arbitrum-sepolia"
} as const satisfies Chain;