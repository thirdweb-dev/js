import type { Chain } from "../src/types";
export default {
  "chain": "Dojima",
  "chainId": 184,
  "explorers": [
    {
      "name": "Dojima Testnet Explorer",
      "url": "https://explorer-test.dojima.network",
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
  "name": "Dojima Testnet",
  "nativeCurrency": {
    "name": "Dojima",
    "symbol": "DOJ",
    "decimals": 18
  },
  "networkId": 184,
  "rpc": [
    "https://184.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-test-d11k.dojima.network"
  ],
  "shortName": "dojtestnet",
  "slug": "dojima-testnet",
  "testnet": true
} as const satisfies Chain;