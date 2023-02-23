export default {
  "name": "AirDAO Testnet",
  "chain": "ambnet-test",
  "icon": {
    "url": "ipfs://QmSxXjvWng3Diz4YwXDV2VqSPgMyzLYBNfkjJcr7rzkxom",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "rpc": [
    "https://airdao-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://network.ambrosus-test.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Amber",
    "symbol": "AMB",
    "decimals": 18
  },
  "infoURL": "https://testnet.airdao.io",
  "shortName": "airdao-test",
  "chainId": 22040,
  "networkId": 22040,
  "explorers": [
    {
      "name": "AirDAO Network Explorer",
      "url": "https://testnet.airdao.io/explorer",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "airdao-testnet"
} as const;