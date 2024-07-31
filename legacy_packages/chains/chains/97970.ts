import type { Chain } from "../src/types";
export default {
  "chain": "OptimusZ7",
  "chainId": 97970,
  "explorers": [
    {
      "name": "OptimusZ7 Testnet Explorer",
      "url": "https://testnet.optimusz7.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.optimusz7.com"
  ],
  "icon": {
    "url": "ipfs://Qmerd9Q3otjDuQAFbdiQyUnZk7UfPvkCr21E5N4VCNvhbj",
    "width": 493,
    "height": 506,
    "format": "png"
  },
  "infoURL": "http://optimusz7.com",
  "name": "OptimusZ7 Testnet",
  "nativeCurrency": {
    "name": "OptimusZ7",
    "symbol": "OZ7",
    "decimals": 18
  },
  "networkId": 97970,
  "rpc": [
    "https://97970.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.optimusz7.com"
  ],
  "shortName": "OZ7t",
  "slug": "optimusz7-testnet",
  "testnet": true
} as const satisfies Chain;