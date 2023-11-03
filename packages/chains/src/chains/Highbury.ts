import type { Chain } from "../types";
export default {
  "chain": "HIGHBURY",
  "chainId": 710,
  "explorers": [
    {
      "name": "Furya EVM Explorer",
      "url": "https://explorer.furya.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://bafkreiby27m6esbsjthmknckq5ktsaaj2z6hylzljbsmvx4fgezdra3q4m",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreiby27m6esbsjthmknckq5ktsaaj2z6hylzljbsmvx4fgezdra3q4m",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://www.fury.black",
  "name": "Highbury",
  "nativeCurrency": {
    "name": "Fury",
    "symbol": "FURY",
    "decimals": 18
  },
  "networkId": 710,
  "rpc": [
    "https://highbury.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://710.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://highbury.furya.io",
    "https://rest.furya.io"
  ],
  "shortName": "fury",
  "slug": "highbury",
  "testnet": false
} as const satisfies Chain;