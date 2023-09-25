import type { Chain } from "../src/types";
export default {
  "chainId": 123,
  "chain": "fuse",
  "name": "Fuse Sparknet",
  "rpc": [
    "https://fuse-sparknet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.fusespark.io"
  ],
  "slug": "fuse-sparknet",
  "icon": {
    "url": "ipfs://QmQg8aqyeaMfHvjzFDtZkb8dUNRYhFezPp8UYVc1HnLpRW/green.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [
    "https://get.fusespark.io"
  ],
  "nativeCurrency": {
    "name": "Spark",
    "symbol": "SPARK",
    "decimals": 18
  },
  "infoURL": "https://docs.fuse.io/general/fuse-network-blockchain/fuse-testnet",
  "shortName": "spark",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;