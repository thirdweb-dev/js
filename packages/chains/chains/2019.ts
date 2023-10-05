import type { Chain } from "../src/types";
export default {
  "chain": "PublicMint",
  "chainId": 2019,
  "explorers": [
    {
      "name": "PublicMint Explorer",
      "url": "https://explorer.tst.publicmint.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://publicmint.com",
  "name": "PublicMint Testnet",
  "nativeCurrency": {
    "name": "USD",
    "symbol": "USD",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://publicmint-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tst.publicmint.io:8545"
  ],
  "shortName": "pmint_test",
  "slug": "publicmint-testnet",
  "testnet": true
} as const satisfies Chain;