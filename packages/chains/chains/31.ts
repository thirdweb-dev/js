export default {
  "name": "RSK Testnet",
  "chain": "RSK",
  "rpc": [
    "https://public-node.testnet.rsk.co",
    "https://mycrypto.testnet.rsk.co"
  ],
  "faucets": [
    "https://faucet.rsk.co/"
  ],
  "nativeCurrency": {
    "name": "Testnet Smart Bitcoin",
    "symbol": "tRBTC",
    "decimals": 18
  },
  "infoURL": "https://rsk.co",
  "shortName": "trsk",
  "chainId": 31,
  "networkId": 31,
  "explorers": [
    {
      "name": "RSK Testnet Explorer",
      "url": "https://explorer.testnet.rsk.co",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "rsk-testnet"
} as const;