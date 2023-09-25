import type { Chain } from "../src/types";
export default {
  "chainId": 2018,
  "chain": "PublicMint",
  "name": "PublicMint Devnet",
  "rpc": [
    "https://publicmint-devnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.dev.publicmint.io:8545"
  ],
  "slug": "publicmint-devnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "USD",
    "symbol": "USD",
    "decimals": 18
  },
  "infoURL": "https://publicmint.com",
  "shortName": "pmint_dev",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "PublicMint Explorer",
      "url": "https://explorer.dev.publicmint.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;