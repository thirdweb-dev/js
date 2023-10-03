import type { Chain } from "../src/types";
export default {
  "chain": "PublicMint",
  "chainId": 2018,
  "explorers": [
    {
      "name": "PublicMint Explorer",
      "url": "https://explorer.dev.publicmint.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://publicmint.com",
  "name": "PublicMint Devnet",
  "nativeCurrency": {
    "name": "USD",
    "symbol": "USD",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://publicmint-devnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.dev.publicmint.io:8545"
  ],
  "shortName": "pmint_dev",
  "slug": "publicmint-devnet",
  "testnet": false
} as const satisfies Chain;