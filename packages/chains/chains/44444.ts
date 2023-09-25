import type { Chain } from "../src/types";
export default {
  "chainId": 44444,
  "chain": "fren",
  "name": "Frenchain",
  "rpc": [
    "https://frenchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-02.frenscan.io"
  ],
  "slug": "frenchain",
  "icon": {
    "url": "ipfs://QmQk41bYX6WpYyUAdRgomZekxP5mbvZXhfxLEEqtatyJv4",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "FREN",
    "symbol": "FREN",
    "decimals": 18
  },
  "infoURL": "https://frenchain.app",
  "shortName": "FREN",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://frenscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;