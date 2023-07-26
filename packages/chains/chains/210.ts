import type { Chain } from "../src/types";
export default {
  "name": "Bitnet",
  "chain": "BTN",
  "icon": {
    "url": "ipfs://QmS9h3nFiCzaBLnBNw8Wot4U7vvEVK45EQfi8nxH4nvrmz",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "rpc": [
    "https://bitnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.bitnet.money",
    "https://rpc.btnscan.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bitnet",
    "symbol": "BTN",
    "decimals": 18
  },
  "infoURL": "https://bitnet.money",
  "shortName": "BTN",
  "chainId": 210,
  "networkId": 210,
  "explorers": [
    {
      "name": "Bitnet Explorer",
      "url": "https://btnscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "bitnet"
} as const satisfies Chain;