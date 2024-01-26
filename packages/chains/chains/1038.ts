import type { Chain } from "../src/types";
export default {
  "chain": "Bronos",
  "chainId": 1038,
  "explorers": [
    {
      "name": "Bronos Testnet Explorer",
      "url": "https://tbroscan.bronos.org",
      "standard": "none",
      "icon": {
        "url": "ipfs://bafybeifkgtmhnq4sxu6jn22i7ass7aih6ubodr77k6ygtu4tjbvpmkw2ga",
        "width": 500,
        "height": 500,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet.bronos.org"
  ],
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
  "networkId": 1038,
  "rpc": [
    "https://bronos-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1038.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-testnet.bronos.org"
  ],
  "shortName": "bronos-testnet",
  "slip44": 1,
  "slug": "bronos-testnet",
  "testnet": true
} as const satisfies Chain;