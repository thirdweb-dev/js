import type { Chain } from "../src/types";
export default {
  "chainId": 122,
  "chain": "FUSE",
  "name": "Fuse Mainnet",
  "rpc": [
    "https://fuse.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.fuse.io"
  ],
  "slug": "fuse",
  "icon": {
    "url": "ipfs://QmQg8aqyeaMfHvjzFDtZkb8dUNRYhFezPp8UYVc1HnLpRW/green.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Fuse",
    "symbol": "FUSE",
    "decimals": 18
  },
  "infoURL": "https://fuse.io/",
  "shortName": "fuse",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;