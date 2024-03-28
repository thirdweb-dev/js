import type { Chain } from "../src/types";
export default {
  "chain": "BEYOND",
  "chainId": 59185,
  "explorers": [
    {
      "name": "Beyond",
      "url": "https://explorerl2new-beyond-indigo-playground-xz87sjgmaj.t.conduit.xyz",
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
  "infoURL": "https://explorerl2new-beyond-indigo-playground-xz87sjgmaj.t.conduit.xyz",
  "name": "BeyondChain Testnet",
  "nativeCurrency": {
    "name": "BEYOND",
    "symbol": "BEYOND",
    "decimals": 18
  },
  "networkId": 59185,
  "redFlags": [],
  "rpc": [
    "https://59185.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-beyond-indigo-playground-xz87sjgmaj.t.conduit.xyz"
  ],
  "shortName": "beyond-indigo-playground-xz87sjgmaj",
  "slug": "beyondchain-testnet",
  "testnet": true
} as const satisfies Chain;