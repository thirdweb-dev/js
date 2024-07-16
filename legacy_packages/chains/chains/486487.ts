import type { Chain } from "../src/types";
export default {
  "chain": "Gobbl Testnet",
  "chainId": 486487,
  "explorers": [
    {
      "name": "Gobbl Testnet Explorer",
      "url": "https://explorer.gobbl.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.gobbl.io"
  ],
  "icon": {
    "url": "ipfs://QmQbJTFnUfWf31d16beZfqM4Fo5NRJjryNrDMyNfj9YQnS",
    "width": 1280,
    "height": 1280,
    "format": "png"
  },
  "infoURL": "https://www.gobbl.io/",
  "name": "Gobbl Testnet",
  "nativeCurrency": {
    "name": "Gobbl Token",
    "symbol": "GOBBL",
    "decimals": 18
  },
  "networkId": 486487,
  "rpc": [
    "https://486487.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.gobbl.io"
  ],
  "shortName": "gbl-testnet",
  "slug": "gobbl-testnet",
  "testnet": true
} as const satisfies Chain;