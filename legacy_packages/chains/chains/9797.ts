import type { Chain } from "../src/types";
export default {
  "chain": "OptimusZ7",
  "chainId": 9797,
  "explorers": [
    {
      "name": "OptimusZ7 Mainnet Explorer",
      "url": "https://explorer.optimusz7.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://Qmerd9Q3otjDuQAFbdiQyUnZk7UfPvkCr21E5N4VCNvhbj",
    "width": 493,
    "height": 506,
    "format": "png"
  },
  "infoURL": "http://optimusz7.com",
  "name": "OptimusZ7 Mainnet",
  "nativeCurrency": {
    "name": "OptimusZ7",
    "symbol": "OZ7",
    "decimals": 18
  },
  "networkId": 9797,
  "rpc": [
    "https://9797.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.optimusz7.com"
  ],
  "shortName": "OZ7m",
  "slug": "optimusz7",
  "testnet": false
} as const satisfies Chain;