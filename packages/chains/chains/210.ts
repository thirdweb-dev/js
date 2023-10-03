import type { Chain } from "../src/types";
export default {
  "chain": "BTN",
  "chainId": 210,
  "explorers": [
    {
      "name": "Bitnet Explorer",
      "url": "https://btnscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmS9h3nFiCzaBLnBNw8Wot4U7vvEVK45EQfi8nxH4nvrmz",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://bitnet.money",
  "name": "Bitnet",
  "nativeCurrency": {
    "name": "Bitnet",
    "symbol": "BTN",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://bitnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.bitnet.money",
    "https://rpc.btnscan.com"
  ],
  "shortName": "BTN",
  "slug": "bitnet",
  "testnet": false
} as const satisfies Chain;