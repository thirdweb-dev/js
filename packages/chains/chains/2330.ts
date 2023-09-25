import type { Chain } from "../src/types";
export default {
  "chainId": 2330,
  "chain": "mainnet",
  "name": "Altcoinchain",
  "rpc": [
    "https://altcoinchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc0.altcoinchain.org/rpc"
  ],
  "slug": "altcoinchain",
  "icon": {
    "url": "ipfs://QmYwHmGC9CRVcKo1LSesqxU31SDj9vk2iQxcFjQArzhix4",
    "width": 720,
    "height": 720,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Altcoin",
    "symbol": "ALT",
    "decimals": 18
  },
  "infoURL": "https://altcoinchain.org",
  "shortName": "alt",
  "testnet": false,
  "status": "active",
  "redFlags": [],
  "explorers": [
    {
      "name": "expedition",
      "url": "http://expedition.altcoinchain.org",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;