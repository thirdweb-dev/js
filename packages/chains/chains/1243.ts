import type { Chain } from "../src/types";
export default {
  "name": "ARC Mainnet",
  "chain": "ARC",
  "icon": {
    "url": "ipfs://bafybeiady63oqduls2pm4aaykzjhahblagokhnpsc5qeq5dmkxqelh7i2i",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "rpc": [
    "https://arc.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-main-1.archiechain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "ARC",
    "symbol": "ARC",
    "decimals": 18
  },
  "infoURL": "https://archiechain.io/",
  "shortName": "ARC",
  "chainId": 1243,
  "networkId": 1243,
  "explorers": [
    {
      "name": "archiescan",
      "url": "https://app.archiescan.io",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "arc"
} as const satisfies Chain;