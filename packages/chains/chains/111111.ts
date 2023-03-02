export default {
  "name": "Siberium Network",
  "chain": "SBR",
  "rpc": [
    "https://siberium-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.main.siberium.net",
    "https://rpc.main.siberium.net.ru"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Siberium",
    "symbol": "SBR",
    "decimals": 18
  },
  "infoURL": "https://siberium.net",
  "shortName": "sbr",
  "chainId": 111111,
  "networkId": 111111,
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
  "explorers": [
    {
      "name": "Siberium Mainnet Explorer - blockscout - 1",
      "url": "https://explorer.main.siberium.net",
      "icon": "siberium",
      "standard": "EIP3091"
    },
    {
      "name": "Siberium Mainnet Explorer - blockscout - 2",
      "url": "https://explorer.main.siberium.net.ru",
      "icon": "siberium",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "siberium-network"
} as const;