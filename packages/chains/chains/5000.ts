export default {
  "name": "Mantle",
  "chain": "ETH",
  "rpc": [
    "https://rpc.mantle.xyz"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BitDAO",
    "symbol": "BIT",
    "decimals": 18
  },
  "infoURL": "https://mantle.xyz",
  "shortName": "mantle",
  "chainId": 5000,
  "networkId": 5000,
  "explorers": [
    {
      "name": "Mantle Explorer",
      "url": "https://explorer.mantle.xyz",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "mantle"
} as const;