import type { Chain } from "../src/types";
export default {
  "chain": "GLC",
  "chainId": 10222,
  "explorers": [
    {
      "name": "GLScan Explorer",
      "url": "https://glscan.io",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmTw21p6UfXVH2BCU81G2Ck28ecoknz4v9mC35fF8Z987i",
        "width": 512,
        "height": 557,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmTw21p6UfXVH2BCU81G2Ck28ecoknz4v9mC35fF8Z987i",
    "width": 512,
    "height": 557,
    "format": "png"
  },
  "infoURL": "https://glscan.io/",
  "name": "GLScan",
  "nativeCurrency": {
    "name": "GLC",
    "symbol": "GLC",
    "decimals": 18
  },
  "networkId": 10222,
  "rpc": [
    "https://10222.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://glc-dataseed.glscan.io/"
  ],
  "shortName": "glc",
  "slip44": 1,
  "slug": "glscan",
  "testnet": false
} as const satisfies Chain;