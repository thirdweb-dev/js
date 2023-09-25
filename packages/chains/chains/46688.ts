import type { Chain } from "../src/types";
export default {
  "chainId": 46688,
  "chain": "FSN",
  "name": "Fusion Testnet",
  "rpc": [
    "https://fusion-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.fusionnetwork.io",
    "wss://testnet.fusionnetwork.io"
  ],
  "slug": "fusion-testnet",
  "icon": {
    "url": "ipfs://QmX3tsEoj7SdaBLLV8VyyCUAmymdEGiSGeuTbxMrEMVvth",
    "width": 31,
    "height": 31,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Testnet Fusion",
    "symbol": "T-FSN",
    "decimals": 18
  },
  "infoURL": "https://fusion.org",
  "shortName": "tfsn",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "fsnscan",
      "url": "https://testnet.fsnscan.com",
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