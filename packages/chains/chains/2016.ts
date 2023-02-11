export default {
  "name": "MainnetZ Mainnet",
  "chain": "NetZ",
  "icon": {
    "url": "ipfs://QmT5gJ5weBiLT3GoYuF5yRTRLdPLCVZ3tXznfqW7M8fxgG",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "rpc": [
    "https://z-mainnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.mainnetz.io"
  ],
  "faucets": [
    "https://faucet.mainnetz.io"
  ],
  "nativeCurrency": {
    "name": "MainnetZ",
    "symbol": "NetZ",
    "decimals": 18
  },
  "infoURL": "https://mainnetz.io",
  "shortName": "NetZm",
  "chainId": 2016,
  "networkId": 2016,
  "explorers": [
    {
      "name": "MainnetZ",
      "url": "https://explorer.mainnetz.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "z-mainnet"
} as const;