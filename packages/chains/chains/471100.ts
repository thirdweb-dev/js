import type { Chain } from "../src/types";
export default {
  "chainId": 471100,
  "chain": "ETH",
  "name": "Patex Sepolia Testnet",
  "rpc": [
    "https://patex-sepolia-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test-rpc.patex.io/"
  ],
  "slug": "patex-sepolia-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://patex.io/",
  "shortName": "psep",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;