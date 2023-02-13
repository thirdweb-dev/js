export default {
  "name": "Fantom Opera",
  "chain": "FTM",
  "rpc": [
    "https://fantom.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ftm.tools"
  ],
  "faucets": [
    "https://free-online-app.com/faucet-for-eth-evm-chains/"
  ],
  "nativeCurrency": {
    "name": "Fantom",
    "symbol": "FTM",
    "decimals": 18
  },
  "infoURL": "https://fantom.foundation",
  "shortName": "ftm",
  "chainId": 250,
  "networkId": 250,
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
      "url": "https://ftmscan.com",
      "icon": "ftmscan",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "fantom"
} as const;