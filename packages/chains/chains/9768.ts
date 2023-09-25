import type { Chain } from "../src/types";
export default {
  "chainId": 9768,
  "chain": "NetZ",
  "name": "MainnetZ Testnet",
  "rpc": [
    "https://z-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.mainnetz.io"
  ],
  "slug": "z-testnet",
  "icon": {
    "url": "ipfs://QmT5gJ5weBiLT3GoYuF5yRTRLdPLCVZ3tXznfqW7M8fxgG",
    "width": 400,
    "height": 400,
    "format": "png"
  },
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
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "MainnetZ",
      "url": "https://testnet.mainnetz.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;