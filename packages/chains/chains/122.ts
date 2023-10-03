import type { Chain } from "../src/types";
export default {
  "chain": "FUSE",
  "chainId": 122,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmQg8aqyeaMfHvjzFDtZkb8dUNRYhFezPp8UYVc1HnLpRW/green.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://fuse.io/",
  "name": "Fuse Mainnet",
  "nativeCurrency": {
    "name": "Fuse",
    "symbol": "FUSE",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://fuse.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.fuse.io"
  ],
  "shortName": "fuse",
  "slug": "fuse",
  "testnet": false
} as const satisfies Chain;