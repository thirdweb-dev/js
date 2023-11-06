import type { Chain } from "../src/types";
export default {
  "chain": "FSN",
  "chainId": 32659,
  "explorers": [
    {
      "name": "fsnscan",
      "url": "https://fsnscan.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmSAFx34SKNi7a139agX12f68oBMo2Ktt9c8yD8aFa14gd",
        "width": 48,
        "height": 51,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmX3tsEoj7SdaBLLV8VyyCUAmymdEGiSGeuTbxMrEMVvth",
    "width": 31,
    "height": 31,
    "format": "svg"
  },
  "infoURL": "https://fusion.org",
  "name": "Fusion Mainnet",
  "nativeCurrency": {
    "name": "Fusion",
    "symbol": "FSN",
    "decimals": 18
  },
  "networkId": 32659,
  "rpc": [
    "https://fusion.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://32659.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.fusionnetwork.io",
    "wss://mainnet.fusionnetwork.io"
  ],
  "shortName": "fsn",
  "slip44": 288,
  "slug": "fusion",
  "testnet": false
} as const satisfies Chain;