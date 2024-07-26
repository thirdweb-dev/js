import type { Chain } from "../src/types";
export default {
  "chain": "Dojima",
  "chainId": 187,
  "explorers": [
    {
      "name": "Dojima Explorer",
      "url": "https://explorer.dojima.network",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmarhJVEb6jVNfW1GP2rcvAfto6DFdr7RSauZQxjd3iFam",
    "width": 379,
    "height": 379,
    "format": "png"
  },
  "infoURL": "https://www.dojima.network/",
  "name": "Dojima",
  "nativeCurrency": {
    "name": "Dojima",
    "symbol": "DOJ",
    "decimals": 18
  },
  "networkId": 187,
  "rpc": [
    "https://187.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-d11k.dojima.network"
  ],
  "shortName": "dojima",
  "slug": "dojima",
  "testnet": false
} as const satisfies Chain;