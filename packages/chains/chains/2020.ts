import type { Chain } from "../src/types";
export default {
  "name": "PublicMint Mainnet",
  "title": "Public Mint Mainnet",
  "chain": "PublicMint",
  "rpc": [
    "https://publicmint.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.publicmint.io:8545"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "USD",
    "symbol": "USD",
    "decimals": 18
  },
  "infoURL": "https://publicmint.com",
  "shortName": "pmint",
  "chainId": 2020,
  "networkId": 2020,
  "slip44": 60,
  "explorers": [
    {
      "name": "PublicMint Explorer",
      "url": "https://explorer.publicmint.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "publicmint"
} as const satisfies Chain;