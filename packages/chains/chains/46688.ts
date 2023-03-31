import type { Chain } from "../src/types";
export default {
  "name": "Fusion Testnet",
  "chain": "FSN",
  "icon": {
    "url": "ipfs://QmX3tsEoj7SdaBLLV8VyyCUAmymdEGiSGeuTbxMrEMVvth",
    "width": 31,
    "height": 31,
    "format": "svg"
  },
  "rpc": [
    "https://fusion-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.fusionnetwork.io",
    "wss://testnet.fusionnetwork.io"
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
    "name": "Testnet Fusion",
    "symbol": "T-FSN",
    "decimals": 18
  },
  "infoURL": "https://fusion.org",
  "shortName": "tfsn",
  "chainId": 46688,
  "networkId": 46688,
  "slip44": 288,
  "explorers": [
    {
      "name": "fsnscan",
      "url": "https://testnet.fsnscan.com",
      "icon": {
        "url": "ipfs://QmSAFx34SKNi7a139agX12f68oBMo2Ktt9c8yD8aFa14gd",
        "width": 48,
        "height": 51,
        "format": "svg"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "fusion-testnet"
} as const satisfies Chain;