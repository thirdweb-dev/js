import type { Chain } from "../src/types";
export default {
  "chain": "Astra",
  "chainId": 11110,
  "explorers": [
    {
      "name": "Astra PingPub Explorer",
      "url": "https://ping.astranaut.io/astra",
      "standard": "none"
    },
    {
      "name": "Astra EVM Explorer (Blockscout)",
      "url": "https://explorer.astranaut.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmaBtaukPNNUNjdJSUAwuFFQMLbZX1Pc3fvXKTKQcds7Kf",
    "width": 104,
    "height": 80,
    "format": "png"
  },
  "infoURL": "https://astranaut.io",
  "name": "Astra",
  "nativeCurrency": {
    "name": "Astra",
    "symbol": "ASA",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://astra.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.astranaut.io",
    "https://rpc1.astranaut.io"
  ],
  "shortName": "astra",
  "slug": "astra",
  "testnet": false
} as const satisfies Chain;