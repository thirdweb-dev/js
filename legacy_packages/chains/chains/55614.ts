import type { Chain } from "../src/types";
export default {
  "chain": "FLA",
  "chainId": 55614,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://flascan.net",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://Qmf1qTbwQwPgsc4btKKxgR7vbqWGSCXjRynScPvxAe8Nzq",
        "width": 112,
        "height": 112,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmPQ1kPJPUMxiZwegUCFZQuZExwNbWWwAB6d5CsDE7npx8",
    "width": 512,
    "height": 512,
    "format": "PNG"
  },
  "name": "Flamma Mainnet",
  "nativeCurrency": {
    "name": "Flamma",
    "symbol": "FLA",
    "decimals": 18
  },
  "networkId": 55614,
  "redFlags": [],
  "rpc": [
    "https://55614.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.flamma.network"
  ],
  "shortName": "FLA",
  "slug": "flamma",
  "testnet": true
} as const satisfies Chain;