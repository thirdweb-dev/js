export default {
  "name": "Polygon zkEVM Mainnet beta",
  "chain": "Polygon",
  "infoURL": "https://polygon.technology/solutions/polygon-zkevm/",
  "shortName": "mainnet-zkEVM-beta",
  "chainId": 1101,
  "faucets": [],
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/polygon/512.png",
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
  "rpc": [
    "https://polygon-zkevm-beta.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://zkevm-rpc.com"
  ],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "explorers": [
    {
      "name": "Polygon zkEVM",
      "url": "https://zkevm.polygonscan.com/",
      "standard": ""
    },
    {
      "name": "Polygon zkEVM explorer",
      "url": "https://explorer.public.zkevm-test.net",
      "standard": "EIP3091"
    }
  ],
  "slug": "polygon-zkevm-beta"
} as const;