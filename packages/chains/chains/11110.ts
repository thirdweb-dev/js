import type { Chain } from "../src/types";
export default {
  "chainId": 11110,
  "chain": "Astra",
  "name": "Astra",
  "rpc": [
    "https://astra.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.astranaut.io",
    "https://rpc1.astranaut.io"
  ],
  "slug": "astra",
  "icon": {
    "url": "ipfs://QmaBtaukPNNUNjdJSUAwuFFQMLbZX1Pc3fvXKTKQcds7Kf",
    "width": 104,
    "height": 80,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Astra",
    "symbol": "ASA",
    "decimals": 18
  },
  "infoURL": "https://astranaut.io",
  "shortName": "astra",
  "testnet": false,
  "redFlags": [],
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
  "features": []
} as const satisfies Chain;