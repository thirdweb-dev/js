import type { Chain } from "../src/types";
export default {
  "chain": "PublicMint",
  "chainId": 2020,
  "explorers": [
    {
      "name": "PublicMint Explorer",
      "url": "https://explorer.publicmint.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://publicmint.com",
  "name": "PublicMint Mainnet",
  "nativeCurrency": {
    "name": "USD",
    "symbol": "USD",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://publicmint.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.publicmint.io:8545"
  ],
  "shortName": "pmint",
  "slug": "publicmint",
  "testnet": false
} as const satisfies Chain;