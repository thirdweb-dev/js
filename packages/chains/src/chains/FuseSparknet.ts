import type { Chain } from "../types";
export default {
  "chain": "fuse",
  "chainId": 123,
  "explorers": [],
  "faucets": [
    "https://get.fusespark.io"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmQg8aqyeaMfHvjzFDtZkb8dUNRYhFezPp8UYVc1HnLpRW/green.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://docs.fuse.io/general/fuse-network-blockchain/fuse-testnet",
  "name": "Fuse Sparknet",
  "nativeCurrency": {
    "name": "Spark",
    "symbol": "SPARK",
    "decimals": 18
  },
  "networkId": 123,
  "redFlags": [],
  "rpc": [
    "https://fuse-sparknet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://123.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.fusespark.io"
  ],
  "shortName": "spark",
  "slug": "fuse-sparknet",
  "testnet": true
} as const satisfies Chain;