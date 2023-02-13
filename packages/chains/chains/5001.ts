export default {
  "name": "Mantle Testnet",
  "chain": "ETH",
  "rpc": [
    "https://mantle-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.mantle.xyz"
  ],
  "faucets": [
    "https://faucet.testnet.mantle.xyz"
  ],
  "nativeCurrency": {
    "name": "Testnet BitDAO",
    "symbol": "BIT",
    "decimals": 18
  },
  "infoURL": "https://mantle.xyz",
  "shortName": "mantle-testnet",
  "chainId": 5001,
  "networkId": 5001,
  "explorers": [
    {
      "name": "Mantle Testnet Explorer",
      "url": "https://explorer.testnet.mantle.xyz",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "mantle-testnet"
} as const;