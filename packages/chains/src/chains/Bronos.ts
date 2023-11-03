import type { Chain } from "../types";
export default {
  "chain": "Bronos",
  "chainId": 1039,
  "explorers": [
    {
      "name": "Bronos Explorer",
      "url": "https://broscan.bronos.org",
      "standard": "none",
      "icon": {
        "url": "ipfs://bafybeifkgtmhnq4sxu6jn22i7ass7aih6ubodr77k6ygtu4tjbvpmkw2ga",
        "width": 500,
        "height": 500,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafybeifkgtmhnq4sxu6jn22i7ass7aih6ubodr77k6ygtu4tjbvpmkw2ga",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://bronos.org",
  "name": "Bronos Mainnet",
  "nativeCurrency": {
    "name": "BRO",
    "symbol": "BRO",
    "decimals": 18
  },
  "networkId": 1039,
  "rpc": [],
  "shortName": "bronos-mainnet",
  "slug": "bronos",
  "testnet": false
} as const satisfies Chain;