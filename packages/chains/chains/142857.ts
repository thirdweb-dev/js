import type { Chain } from "../src/types";
export default {
  "name": "ICPlaza Mainnet",
  "chain": "ICPlaza",
  "icon": {
    "url": "ipfs://QmQpKKwpqrx77VA4SJLEWhuv9eLFMcVV9uvxRCLb6gdgCX",
    "width": 847,
    "height": 906,
    "format": "png"
  },
  "rpc": [
    "https://icplaza.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpcmainnet.ic-plaza.org/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ict",
    "symbol": "ict",
    "decimals": 18
  },
  "infoURL": "https://docs.ic-plaza.org/",
  "shortName": "ICPlaza",
  "chainId": 142857,
  "networkId": 142857,
  "explorers": [
    {
      "name": "ICPlaza",
      "url": "https://browsemainnet.ic-plaza.org/index",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "icplaza"
} as const satisfies Chain;