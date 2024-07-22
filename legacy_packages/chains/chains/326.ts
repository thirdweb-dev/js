import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 326,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmVRdhjaBYeUVCkF8SUYMqAgGtbePYaozzy4YtMVKazLut",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "infoURL": "https://grvt.io/",
  "name": "GRVT Sepolia Testnet",
  "nativeCurrency": {
    "name": "ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 326,
  "rpc": [],
  "shortName": "grvt-sepolia",
  "slug": "grvt-sepolia-testnet",
  "testnet": true
} as const satisfies Chain;