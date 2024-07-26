import type { Chain } from "../src/types";
export default {
  "chain": "FLA",
  "chainId": 6550,
  "explorers": [
    {
      "name": "FLASCAN",
      "url": "https://testnet.flascan.net/",
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
    "format": "png"
  },
  "name": "Flamma Testenet",
  "nativeCurrency": {
    "name": "Flamma",
    "symbol": "FLA",
    "decimals": 18
  },
  "networkId": 6550,
  "redFlags": [],
  "rpc": [
    "https://6550.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnetrpc.flamma.network/"
  ],
  "shortName": "FLA",
  "slug": "flamma-testenet",
  "testnet": true
} as const satisfies Chain;