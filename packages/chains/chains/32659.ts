import type { Chain } from "../src/types";
export default {
  "chainId": 32659,
  "chain": "FSN",
  "name": "Fusion Mainnet",
  "rpc": [
    "https://fusion.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.fusionnetwork.io",
    "wss://mainnet.fusionnetwork.io"
  ],
  "slug": "fusion",
  "icon": {
    "url": "ipfs://QmX3tsEoj7SdaBLLV8VyyCUAmymdEGiSGeuTbxMrEMVvth",
    "width": 31,
    "height": 31,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Fusion",
    "symbol": "FSN",
    "decimals": 18
  },
  "infoURL": "https://fusion.org",
  "shortName": "fsn",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "fsnscan",
      "url": "https://fsnscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;