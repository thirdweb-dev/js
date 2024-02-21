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
  "infoURL": "https://publicmint.com",
  "name": "PublicMint Devnet",
  "nativeCurrency": {
    "name": "USD",
    "symbol": "USD",
    "decimals": 18
  },
  "networkId": 2018,
  "rpc": [
    "https://2018.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.dev.publicmint.io:8545"
  ],
  "shortName": "pmint_dev",
  "slip44": 60,
  "slug": "publicmint-devnet",
  "testnet": false,
  "title": "Public Mint Devnet"
} as const satisfies Chain;