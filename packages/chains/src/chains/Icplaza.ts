import type { Chain } from "../types";
export default {
  "chain": "ICPlaza",
  "chainId": 142857,
  "explorers": [
    {
      "name": "ICPlaza",
      "url": "https://browsemainnet.ic-plaza.org/index",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmQpKKwpqrx77VA4SJLEWhuv9eLFMcVV9uvxRCLb6gdgCX",
    "width": 847,
    "height": 906,
    "format": "png"
  },
  "infoURL": "https://docs.ic-plaza.org/",
  "name": "ICPlaza Mainnet",
  "nativeCurrency": {
    "name": "ict",
    "symbol": "ict",
    "decimals": 18
  },
  "networkId": 142857,
  "rpc": [
    "https://icplaza.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://142857.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpcmainnet.ic-plaza.org/"
  ],
  "shortName": "ICPlaza",
  "slug": "icplaza",
  "testnet": false
} as const satisfies Chain;