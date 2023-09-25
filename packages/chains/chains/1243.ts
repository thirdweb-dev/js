import type { Chain } from "../src/types";
export default {
  "chainId": 1243,
  "chain": "ARC",
  "name": "ARC Mainnet",
  "rpc": [
    "https://arc.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-main-1.archiechain.io"
  ],
  "slug": "arc",
  "icon": {
    "url": "ipfs://bafybeiady63oqduls2pm4aaykzjhahblagokhnpsc5qeq5dmkxqelh7i2i",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "ARC",
    "symbol": "ARC",
    "decimals": 18
  },
  "infoURL": "https://archiechain.io/",
  "shortName": "ARC",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "archiescan",
      "url": "https://app.archiescan.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;