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
  "infoURL": "https://publicmint.com",
  "name": "PublicMint Testnet",
  "nativeCurrency": {
    "name": "USD",
    "symbol": "USD",
    "decimals": 18
  },
  "networkId": 2019,
  "rpc": [
    "https://publicmint-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2019.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tst.publicmint.io:8545"
  ],
  "shortName": "pmint_test",
  "slip44": 1,
  "slug": "publicmint-testnet",
  "testnet": true,
  "title": "Public Mint Testnet"
} as const satisfies Chain;