import type { Chain } from "../src/types";
export default {
  "chain": "NetZ",
  "chainId": 2016,
  "explorers": [
    {
      "name": "MainnetZ",
      "url": "https://explorer.mainnetz.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.mainnetz.io"
  ],
  "icon": {
    "url": "ipfs://QmT5gJ5weBiLT3GoYuF5yRTRLdPLCVZ3tXznfqW7M8fxgG",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://mainnetz.io",
  "name": "MainnetZ Mainnet",
  "nativeCurrency": {
    "name": "MainnetZ",
    "symbol": "NetZ",
    "decimals": 18
  },
  "networkId": 2016,
  "rpc": [
    "https://z-mainnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2016.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.mainnetz.io"
  ],
  "shortName": "NetZm",
  "slug": "z-mainnet",
  "testnet": false
} as const satisfies Chain;