export default {
  "name": "Optimism",
  "chain": "ETH",
  "rpc": [
    "https://optimism.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}",
    "https://optimism-mainnet.infura.io/v3/${INFURA_API_KEY}",
    "https://mainnet.optimism.io/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://optimism.io",
  "shortName": "oeth",
  "chainId": 10,
  "networkId": 10,
  "explorers": [
    {
      "name": "etherscan",
      "url": "https://optimistic.etherscan.io",
      "standard": "EIP3091"
    }
  ],
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/optimism/512.png",
    "height": 512,
    "width": 512,
    "format": "png",
    "sizes": [
      512,
      256,
      128,
      64,
      32,
      16
    ]
  },
  "testnet": false,
  "slug": "optimism"
} as const;