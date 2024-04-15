import type { Chain } from "../src/types";
export default {
  "chain": "BSTC",
  "chainId": 7007,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://bstscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://bstchain.io",
  "name": "BST Chain",
  "nativeCurrency": {
    "name": "BST Chain",
    "symbol": "BSTC",
    "decimals": 18
  },
  "networkId": 7007,
  "rpc": [
    "https://7007.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.bstchain.io/"
  ],
  "shortName": "BSTC",
  "slug": "bst-chain",
  "testnet": false
} as const satisfies Chain;