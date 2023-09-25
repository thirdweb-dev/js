import type { Chain } from "../src/types";
export default {
  "chainId": 1038,
  "chain": "Bronos",
  "name": "Bronos Testnet",
  "rpc": [
    "https://bronos-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-testnet.bronos.org"
  ],
  "slug": "bronos-testnet",
  "icon": {
    "url": "ipfs://bafybeifkgtmhnq4sxu6jn22i7ass7aih6ubodr77k6ygtu4tjbvpmkw2ga",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "faucets": [
    "https://faucet.bronos.org"
  ],
  "nativeCurrency": {
    "name": "tBRO",
    "symbol": "tBRO",
    "decimals": 18
  },
  "infoURL": "https://bronos.org",
  "shortName": "bronos-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Bronos Testnet Explorer",
      "url": "https://tbroscan.bronos.org",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;