import type { Chain } from "../src/types";
export default {
  "chainId": 2016,
  "chain": "NetZ",
  "name": "MainnetZ Mainnet",
  "rpc": [
    "https://z-mainnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.mainnetz.io"
  ],
  "slug": "z-mainnet",
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
  "infoURL": "https://mainnetz.io",
  "shortName": "NetZm",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "MainnetZ",
      "url": "https://explorer.mainnetz.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;