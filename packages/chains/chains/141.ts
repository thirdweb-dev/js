import type { Chain } from "../src/types";
export default {
  "chainId": 141,
  "chain": "OPENPIECE",
  "name": "Openpiece Testnet",
  "rpc": [
    "https://openpiece-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.openpiece.io"
  ],
  "slug": "openpiece-testnet",
  "icon": {
    "url": "ipfs://QmVTahJkdSH3HPYsJMK2GmqfWZjLyxE7cXy1aHEnHU3vp2",
    "width": 250,
    "height": 250,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Belly",
    "symbol": "BELLY",
    "decimals": 18
  },
  "infoURL": "https://cryptopiece.online",
  "shortName": "OPtest",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Belly Scan",
      "url": "https://testnet.bellyscan.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;