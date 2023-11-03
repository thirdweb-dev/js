import type { Chain } from "../types";
export default {
  "chain": "fren",
  "chainId": 44444,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://frenscan.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmQk41bYX6WpYyUAdRgomZekxP5mbvZXhfxLEEqtatyJv4",
        "width": 128,
        "height": 128,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmQk41bYX6WpYyUAdRgomZekxP5mbvZXhfxLEEqtatyJv4",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "infoURL": "https://frenchain.app",
  "name": "Frenchain",
  "nativeCurrency": {
    "name": "FREN",
    "symbol": "FREN",
    "decimals": 18
  },
  "networkId": 44444,
  "rpc": [
    "https://frenchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://44444.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-02.frenscan.io"
  ],
  "shortName": "FREN",
  "slug": "frenchain",
  "testnet": false
} as const satisfies Chain;