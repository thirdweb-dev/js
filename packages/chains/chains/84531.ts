export default {
  "name": "Base Testnet Goerli",
  "chain": "ETH",
  "rpc": [
    "https://base-testnet-goerli.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://goerli.base.org/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Base Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://base.org/",
  "shortName": "base-gor",
  "chainId": 84531,
  "explorers": [],
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png",
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
  "testnet": true,
  "slug": "base-testnet-goerli"
} as const;