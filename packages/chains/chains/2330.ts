import type { Chain } from "../src/types";
export default {
  "chain": "mainnet",
  "chainId": 2330,
  "explorers": [
    {
      "name": "expedition",
      "url": "http://expedition.altcoinchain.org",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmYwHmGC9CRVcKo1LSesqxU31SDj9vk2iQxcFjQArzhix4",
        "width": 720,
        "height": 720,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmYwHmGC9CRVcKo1LSesqxU31SDj9vk2iQxcFjQArzhix4",
    "width": 720,
    "height": 720,
    "format": "png"
  },
  "infoURL": "https://altcoinchain.org",
  "name": "Altcoinchain",
  "nativeCurrency": {
    "name": "Altcoin",
    "symbol": "ALT",
    "decimals": 18
  },
  "networkId": 2330,
  "rpc": [
    "https://altcoinchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2330.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc0.altcoinchain.org/rpc"
  ],
  "shortName": "alt",
  "slug": "altcoinchain",
  "status": "active",
  "testnet": false
} as const satisfies Chain;