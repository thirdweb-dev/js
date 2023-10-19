import type { Chain } from "../src/types";
export default {
  "chain": "NetZ",
  "chainId": 9768,
  "explorers": [
    {
      "name": "MainnetZ",
      "url": "https://testnet.mainnetz.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.mainnetz.io"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmT5gJ5weBiLT3GoYuF5yRTRLdPLCVZ3tXznfqW7M8fxgG",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://testnet.mainnetz.io",
  "name": "MainnetZ Testnet",
  "nativeCurrency": {
    "name": "MainnetZ",
    "symbol": "NetZ",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://z-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.mainnetz.io"
  ],
  "shortName": "NetZt",
  "slug": "z-testnet",
  "testnet": true
} as const satisfies Chain;