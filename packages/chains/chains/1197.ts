export default {
  "name": "Iora Chain",
  "chain": "IORA",
  "icon": {
    "url": "ipfs://bafybeiehps5cqdhqottu2efo4jeehwpkz5rbux3cjxd75rm6rjm4sgs2wi",
    "width": 250,
    "height": 250,
    "format": "png"
  },
  "rpc": [
    "https://iora-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dataseed.iorachain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Iora",
    "symbol": "IORA",
    "decimals": 18
  },
  "infoURL": "https://iorachain.com",
  "shortName": "iora",
  "chainId": 1197,
  "networkId": 1197,
  "explorers": [
    {
      "name": "ioraexplorer",
      "url": "https://explorer.iorachain.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "iora-chain"
} as const;