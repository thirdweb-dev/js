import type { Chain } from "../src/types";
export default {
  "chain": "OPENPIECE",
  "chainId": 54,
  "explorers": [
    {
      "name": "Belly Scan",
      "url": "https://bellyscan.com",
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
  "name": "Openpiece Mainnet",
  "nativeCurrency": {
    "name": "Belly",
    "symbol": "BELLY",
    "decimals": 18
  },
  "networkId": 54,
  "rpc": [
    "https://openpiece.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://54.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.openpiece.io"
  ],
  "shortName": "OP",
  "slug": "openpiece",
  "testnet": false
} as const satisfies Chain;