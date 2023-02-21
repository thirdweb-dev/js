export default {
  "name": "MainnetZ Testnet",
  "chain": "NetZ",
  "icon": {
    "url": "ipfs://QmT5gJ5weBiLT3GoYuF5yRTRLdPLCVZ3tXznfqW7M8fxgG",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "rpc": [
    "https://z-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.mainnetz.io"
  ],
  "faucets": [
    "https://faucet.mainnetz.io"
  ],
  "nativeCurrency": {
    "name": "MainnetZ",
    "symbol": "NetZ",
    "decimals": 18
  },
  "infoURL": "https://testnet.mainnetz.io",
  "shortName": "NetZt",
  "chainId": 9768,
  "networkId": 9768,
  "explorers": [
    {
      "name": "MainnetZ",
      "url": "https://testnet.mainnetz.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "z-testnet"
} as const;