import type { Chain } from "../src/types";
export default {
  "chainId": 54,
  "chain": "OPENPIECE",
  "name": "Openpiece Mainnet",
  "rpc": [
    "https://openpiece.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.openpiece.io"
  ],
  "slug": "openpiece",
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
  "shortName": "OP",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Belly Scan",
      "url": "https://bellyscan.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;