import type { Chain } from "../src/types";
export default {
  "chain": "ARC",
  "chainId": 1243,
  "explorers": [
    {
      "name": "archiescan",
      "url": "https://app.archiescan.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://bafybeiady63oqduls2pm4aaykzjhahblagokhnpsc5qeq5dmkxqelh7i2i",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://archiechain.io/",
  "name": "ARC Mainnet",
  "nativeCurrency": {
    "name": "ARC",
    "symbol": "ARC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://arc.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-main-1.archiechain.io"
  ],
  "shortName": "ARC",
  "slug": "arc",
  "testnet": false
} as const satisfies Chain;