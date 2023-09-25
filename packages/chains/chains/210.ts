import type { Chain } from "../src/types";
export default {
  "chainId": 210,
  "chain": "BTN",
  "name": "Bitnet",
  "rpc": [
    "https://bitnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.bitnet.money",
    "https://rpc.btnscan.com"
  ],
  "slug": "bitnet",
  "icon": {
    "url": "ipfs://QmS9h3nFiCzaBLnBNw8Wot4U7vvEVK45EQfi8nxH4nvrmz",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Bitnet",
    "symbol": "BTN",
    "decimals": 18
  },
  "infoURL": "https://bitnet.money",
  "shortName": "BTN",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Bitnet Explorer",
      "url": "https://btnscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;