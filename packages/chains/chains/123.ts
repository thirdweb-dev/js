export default {
  "name": "Fuse Sparknet",
  "chain": "fuse",
  "rpc": [
    "https://fuse-sparknet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.fusespark.io"
  ],
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
  "chainId": 123,
  "networkId": 123,
  "testnet": true,
  "icon": {
    "url": "ipfs://QmQg8aqyeaMfHvjzFDtZkb8dUNRYhFezPp8UYVc1HnLpRW/green.png",
    "format": "png",
    "width": 512,
    "height": 512
  },
  "slug": "fuse-sparknet"
} as const;