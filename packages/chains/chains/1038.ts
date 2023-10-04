import type { Chain } from "../src/types";
export default {
  "chain": "Bronos",
  "chainId": 1038,
  "explorers": [
    {
      "name": "Bronos Testnet Explorer",
      "url": "https://tbroscan.bronos.org",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet.bronos.org"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://bafybeifkgtmhnq4sxu6jn22i7ass7aih6ubodr77k6ygtu4tjbvpmkw2ga",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://bronos.org",
  "name": "Bronos Testnet",
  "nativeCurrency": {
    "name": "tBRO",
    "symbol": "tBRO",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://bronos-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-testnet.bronos.org"
  ],
  "shortName": "bronos-testnet",
  "slug": "bronos-testnet",
  "testnet": true
} as const satisfies Chain;