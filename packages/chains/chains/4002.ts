export default {
  "name": "Fantom Testnet",
  "chain": "FTM",
  "rpc": [
    "https://fantom-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.fantom.network"
  ],
  "faucets": [
    "https://faucet.fantom.network"
  ],
  "nativeCurrency": {
    "name": "Fantom",
    "symbol": "FTM",
    "decimals": 18
  },
  "infoURL": "https://docs.fantom.foundation/quick-start/short-guide#fantom-testnet",
  "shortName": "tftm",
  "chainId": 4002,
  "networkId": 4002,
  "icon": {
    "url": "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/fantom/512.png",
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
  "explorers": [
    {
      "name": "ftmscan",
      "url": "https://testnet.ftmscan.com",
      "icon": "ftmscan",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "fantom-testnet"
} as const;