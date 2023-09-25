import type { Chain } from "../src/types";
export default {
  "chainId": 1039,
  "chain": "Bronos",
  "name": "Bronos Mainnet",
  "rpc": [],
  "slug": "bronos",
  "icon": {
    "url": "ipfs://bafybeifkgtmhnq4sxu6jn22i7ass7aih6ubodr77k6ygtu4tjbvpmkw2ga",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "BRO",
    "symbol": "BRO",
    "decimals": 18
  },
  "infoURL": "https://bronos.org",
  "shortName": "bronos-mainnet",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Bronos Explorer",
      "url": "https://broscan.bronos.org",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;