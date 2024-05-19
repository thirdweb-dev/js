import type { Chain } from "../src/types";
export default {
  "chain": "DeFiVerse Testnet",
  "chainId": 17117,
  "explorers": [
    {
      "name": "DeFiVerse Testnet Explorer",
      "url": "https://scan-testnet.defi-verse.org",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmaSqPELi11UepS3odwHyiwfUPkLBnE4WP4zNkwumHoPmw",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmaSqPELi11UepS3odwHyiwfUPkLBnE4WP4zNkwumHoPmw",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://defi-verse.org",
  "name": "DeFiVerse Testnet",
  "nativeCurrency": {
    "name": "Oasys",
    "symbol": "OAS",
    "decimals": 18
  },
  "networkId": 17117,
  "rpc": [
    "https://17117.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.defi-verse.org/"
  ],
  "shortName": "DFV-testnet",
  "slug": "defiverse-testnet",
  "testnet": true
} as const satisfies Chain;