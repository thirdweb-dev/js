import type { Chain } from "../src/types";
export default {
  "chain": "Bronos",
  "chainId": 1039,
  "explorers": [
    {
      "name": "Bronos Explorer",
      "url": "https://broscan.bronos.org",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
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
  "redFlags": [],
  "rpc": [],
  "shortName": "bronos-mainnet",
  "slug": "bronos",
  "testnet": false
} as const satisfies Chain;