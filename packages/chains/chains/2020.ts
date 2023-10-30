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
  "infoURL": "https://publicmint.com",
  "name": "PublicMint Mainnet",
  "nativeCurrency": {
    "name": "USD",
    "symbol": "USD",
    "decimals": 18
  },
  "networkId": 2020,
  "rpc": [
    "https://publicmint.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2020.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.publicmint.io:8545"
  ],
  "shortName": "pmint",
  "slip44": 60,
  "slug": "publicmint",
  "testnet": false,
  "title": "Public Mint Mainnet"
} as const satisfies Chain;