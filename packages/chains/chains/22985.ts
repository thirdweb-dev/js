import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 22985,
  "explorers": [
    {
      "name": "beyond-sepolia-3wng1zu3j3 explorer",
      "url": "https://explorerl2new-beyond-sepolia-3wng1zu3j3.t.conduit.xyz",
      "standard": "standard",
      "icon": {
        "url": "ipfs://QmbLxRVZ27Yy6RE9xAdYgSxGPB1TjPtcxahy6uNnp2Pt6T/Beyond.jpg",
        "width": 512,
        "height": 512,
        "format": "jpg"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmbLxRVZ27Yy6RE9xAdYgSxGPB1TjPtcxahy6uNnp2Pt6T/Beyond.jpg",
    "width": 512,
    "height": 512,
    "format": "jpg"
  },
  "infoURL": "https://explorerl2new-beyond-sepolia-3wng1zu3j3.t.conduit.xyz",
  "name": "Beyond Sepolia",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 22985,
  "redFlags": [],
  "rpc": [
    "https://22985.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-beyond-sepolia-3wng1zu3j3.t.conduit.xyz"
  ],
  "shortName": "beyond-sepolia",
  "slug": "beyond-sepolia",
  "testnet": true
} as const satisfies Chain;