export default {
  "name": "PublicMint Testnet",
  "title": "Public Mint Testnet",
  "chain": "PublicMint",
  "rpc": [
    "https://publicmint-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tst.publicmint.io:8545"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "USD",
    "symbol": "USD",
    "decimals": 18
  },
  "infoURL": "https://publicmint.com",
  "shortName": "pmint_test",
  "chainId": 2019,
  "networkId": 2019,
  "slip44": 60,
  "explorers": [
    {
      "name": "PublicMint Explorer",
      "url": "https://explorer.tst.publicmint.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "publicmint-testnet"
} as const;