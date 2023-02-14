export default {
  "name": "AirDAO Mainnet",
  "chain": "ambnet",
  "icon": {
    "url": "ipfs://QmSxXjvWng3Diz4YwXDV2VqSPgMyzLYBNfkjJcr7rzkxom",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "rpc": [
    "https://airdao.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://network.ambrosus.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Amber",
    "symbol": "AMB",
    "decimals": 18
  },
  "infoURL": "https://airdao.io",
  "shortName": "airdao",
  "chainId": 16718,
  "networkId": 16718,
  "explorers": [
    {
      "name": "AirDAO Network Explorer",
      "url": "https://airdao.io/explorer",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "airdao"
} as const;