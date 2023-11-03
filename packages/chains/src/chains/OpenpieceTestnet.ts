import type { Chain } from "../types";
export default {
  "chain": "OPENPIECE",
  "chainId": 141,
  "explorers": [
    {
      "name": "Belly Scan",
      "url": "https://testnet.bellyscan.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmVTahJkdSH3HPYsJMK2GmqfWZjLyxE7cXy1aHEnHU3vp2",
    "width": 250,
    "height": 250,
    "format": "png"
  },
  "infoURL": "https://cryptopiece.online",
  "name": "Openpiece Testnet",
  "nativeCurrency": {
    "name": "Belly",
    "symbol": "BELLY",
    "decimals": 18
  },
  "networkId": 141,
  "rpc": [
    "https://openpiece-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://141.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.openpiece.io"
  ],
  "shortName": "OPtest",
  "slug": "openpiece-testnet",
  "testnet": true
} as const satisfies Chain;