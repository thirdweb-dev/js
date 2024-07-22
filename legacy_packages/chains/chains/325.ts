import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 325,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmVRdhjaBYeUVCkF8SUYMqAgGtbePYaozzy4YtMVKazLut",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "infoURL": "https://grvt.io/",
  "name": "GRVT Mainnet",
  "nativeCurrency": {
    "name": "ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 325,
  "rpc": [],
  "shortName": "grvt",
  "slug": "grvt",
  "testnet": false
} as const satisfies Chain;