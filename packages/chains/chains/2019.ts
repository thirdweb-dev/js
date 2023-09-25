import type { Chain } from "../src/types";
export default {
  "chainId": 2019,
  "chain": "PublicMint",
  "name": "PublicMint Testnet",
  "rpc": [
    "https://publicmint-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tst.publicmint.io:8545"
  ],
  "slug": "publicmint-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "USD",
    "symbol": "USD",
    "decimals": 18
  },
  "infoURL": "https://publicmint.com",
  "shortName": "pmint_test",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "PublicMint Explorer",
      "url": "https://explorer.tst.publicmint.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;