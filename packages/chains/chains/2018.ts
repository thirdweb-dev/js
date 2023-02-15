export default {
  "name": "PublicMint Devnet",
  "title": "Public Mint Devnet",
  "chain": "PublicMint",
  "rpc": [
    "https://publicmint-devnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.dev.publicmint.io:8545"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "USD",
    "symbol": "USD",
    "decimals": 18
  },
  "infoURL": "https://publicmint.com",
  "shortName": "pmint_dev",
  "chainId": 2018,
  "networkId": 2018,
  "slip44": 60,
  "explorers": [
    {
      "name": "PublicMint Explorer",
      "url": "https://explorer.dev.publicmint.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "publicmint-devnet"
} as const;