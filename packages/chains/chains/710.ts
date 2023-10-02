import type { Chain } from "../src/types";
export default {
  "name": "Highbury",
  "chain": "HIGHBURY",
  "rpc": [
    "https://highbury.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://highbury.furya.io",
    "https://rest.furya.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Fury",
    "symbol": "FURY",
    "decimals": 18
  },
  "infoURL": "https://www.fury.black",
  "shortName": "fury",
  "chainId": 710,
  "networkId": 710,
  "icon": {
    "url": "ipfs://bafkreiby27m6esbsjthmknckq5ktsaaj2z6hylzljbsmvx4fgezdra3q4m",
    "width": 512,
    "height": 512,
    "format": "png"
  },
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
  "testnet": false,
  "slug": "highbury"
} as const satisfies Chain;