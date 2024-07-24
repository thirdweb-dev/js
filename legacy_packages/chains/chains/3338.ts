import type { Chain } from "../src/types";
export default {
  "chain": "peaq",
  "chainId": 3338,
  "explorers": [
    {
      "name": "Polkadot.js",
      "url": "https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Fpeaq.api.onfinality.io%2Fpublic-ws#/explorer",
      "standard": "none"
    },
    {
      "name": "Subscan",
      "url": "https://peaq.subscan.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafybeihnkvboj4n6psjnzn4omaopfekvag4kax22l4agx6zppp7xx3d6ky",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "infoURL": "https://www.peaq.network",
  "name": "The peaq Network",
  "nativeCurrency": {
    "name": "peaq",
    "symbol": "PEAQ",
    "decimals": 18
  },
  "networkId": 3338,
  "rpc": [
    "https://3338.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://peaq.api.onfinality.io/public",
    "https://peaq-rpc.dwellir.com"
  ],
  "shortName": "PEAQ",
  "slug": "the-peaq-network",
  "testnet": false
} as const satisfies Chain;