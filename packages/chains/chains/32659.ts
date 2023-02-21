export default {
  "name": "Fusion Mainnet",
  "chain": "FSN",
  "icon": {
    "url": "ipfs://QmX3tsEoj7SdaBLLV8VyyCUAmymdEGiSGeuTbxMrEMVvth",
    "width": 31,
    "height": 31,
    "format": "svg"
  },
  "rpc": [
    "https://fusion.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.fusionnetwork.io",
    "wss://mainnet.fusionnetwork.io"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Fusion",
    "symbol": "FSN",
    "decimals": 18
  },
  "infoURL": "https://fusion.org",
  "shortName": "fsn",
  "chainId": 32659,
  "networkId": 32659,
  "slip44": 288,
  "explorers": [
    {
      "name": "fsnscan",
      "url": "https://fsnscan.com",
      "icon": "fsnscan",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "fusion"
} as const;