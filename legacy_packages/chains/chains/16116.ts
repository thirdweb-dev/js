import type { Chain } from "../src/types";
export default {
  "chain": "DeFiVerse",
  "chainId": 16116,
  "explorers": [
    {
      "name": "DeFiVerse Explorer",
      "url": "https://scan.defi-verse.org",
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
  "name": "DeFiVerse Mainnet",
  "nativeCurrency": {
    "name": "Oasys",
    "symbol": "OAS",
    "decimals": 18
  },
  "networkId": 16116,
  "parent": {
    "type": "L2",
    "chain": "eip155-248"
  },
  "rpc": [
    "https://16116.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.defi-verse.org/"
  ],
  "shortName": "DFV",
  "slug": "defiverse",
  "testnet": false
} as const satisfies Chain;