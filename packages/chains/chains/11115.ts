import type { Chain } from "../src/types";
export default {
  "chainId": 11115,
  "chain": "Astra",
  "name": "Astra Testnet",
  "rpc": [
    "https://astra-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.astranaut.dev"
  ],
  "slug": "astra-testnet",
  "icon": {
    "url": "ipfs://QmaBtaukPNNUNjdJSUAwuFFQMLbZX1Pc3fvXKTKQcds7Kf",
    "width": 104,
    "height": 80,
    "format": "png"
  },
  "faucets": [
    "https://faucet.astranaut.dev"
  ],
  "nativeCurrency": {
    "name": "test-Astra",
    "symbol": "tASA",
    "decimals": 18
  },
  "infoURL": "https://astranaut.io",
  "shortName": "astra-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Astra PingPub Explorer",
      "url": "https://ping.astranaut.dev/astra",
      "standard": "none"
    },
    {
      "name": "Astra EVM Explorer",
      "url": "https://explorer.astranaut.dev",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;