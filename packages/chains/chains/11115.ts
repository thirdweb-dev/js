import type { Chain } from "../src/types";
export default {
  "chain": "Astra",
  "chainId": 11115,
  "explorers": [
    {
      "name": "Astra EVM Explorer",
      "url": "https://explorer.astranaut.dev",
      "standard": "EIP3091"
    },
    {
      "name": "Astra PingPub Explorer",
      "url": "https://ping.astranaut.dev/astra",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet.astranaut.dev"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmaBtaukPNNUNjdJSUAwuFFQMLbZX1Pc3fvXKTKQcds7Kf",
    "width": 104,
    "height": 80,
    "format": "png"
  },
  "infoURL": "https://astranaut.io",
  "name": "Astra Testnet",
  "nativeCurrency": {
    "name": "test-Astra",
    "symbol": "tASA",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://astra-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.astranaut.dev"
  ],
  "shortName": "astra-testnet",
  "slug": "astra-testnet",
  "testnet": true
} as const satisfies Chain;