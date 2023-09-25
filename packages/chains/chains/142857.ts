import type { Chain } from "../src/types";
export default {
  "chainId": 142857,
  "chain": "ICPlaza",
  "name": "ICPlaza Mainnet",
  "rpc": [
    "https://icplaza.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpcmainnet.ic-plaza.org/"
  ],
  "slug": "icplaza",
  "icon": {
    "url": "ipfs://QmQpKKwpqrx77VA4SJLEWhuv9eLFMcVV9uvxRCLb6gdgCX",
    "width": 847,
    "height": 906,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "ict",
    "symbol": "ict",
    "decimals": 18
  },
  "infoURL": "https://docs.ic-plaza.org/",
  "shortName": "ICPlaza",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "ICPlaza",
      "url": "https://browsemainnet.ic-plaza.org/index",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;