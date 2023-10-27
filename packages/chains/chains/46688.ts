import type { Chain } from "../src/types";
export default {
  "chain": "FSN",
  "chainId": 46688,
  "explorers": [
    {
      "name": "fsnscan",
      "url": "https://testnet.fsnscan.com",
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
  "name": "Fusion Testnet",
  "nativeCurrency": {
    "name": "Testnet Fusion",
    "symbol": "T-FSN",
    "decimals": 18
  },
  "networkId": 46688,
  "rpc": [
    "https://fusion-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://46688.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.fusionnetwork.io",
    "wss://testnet.fusionnetwork.io"
  ],
  "shortName": "tfsn",
  "slip44": 288,
  "slug": "fusion-testnet",
  "testnet": true
} as const satisfies Chain;