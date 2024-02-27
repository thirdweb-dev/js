import type { Chain } from "../src/types";
export default {
  "chain": "DCSM",
  "chainId": 19224,
  "explorers": [
    {
      "name": "Decentraconnect Social",
      "url": "https://decentraconnect.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmatvJXLgMthjXwydGBVFRtga9fZXJ3qFEVJ6cMRxniFUc",
    "width": 307,
    "height": 314,
    "format": "png"
  },
  "infoURL": "https://docs.decentraconnect.io",
  "name": "Decentraconnect Social",
  "nativeCurrency": {
    "name": "Decentraconnect Social",
    "symbol": "DCSM",
    "decimals": 18
  },
  "networkId": 19224,
  "rpc": [
    "https://19224.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.decentraconnect.io"
  ],
  "shortName": "DCSMs",
  "slug": "decentraconnect-social",
  "testnet": false
} as const satisfies Chain;