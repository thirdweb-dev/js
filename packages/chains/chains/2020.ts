import type { Chain } from "../src/types";
export default {
  "chainId": 2020,
  "chain": "PublicMint",
  "name": "PublicMint Mainnet",
  "rpc": [
    "https://publicmint.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.publicmint.io:8545"
  ],
  "slug": "publicmint",
  "faucets": [],
  "nativeCurrency": {
    "name": "USD",
    "symbol": "USD",
    "decimals": 18
  },
  "infoURL": "https://publicmint.com",
  "shortName": "pmint",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "PublicMint Explorer",
      "url": "https://explorer.publicmint.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;