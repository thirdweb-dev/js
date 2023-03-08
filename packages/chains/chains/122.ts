export default {
  "name": "Fuse Mainnet",
  "chain": "FUSE",
  "rpc": [
    "https://fuse.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.fuse.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Fuse",
    "symbol": "FUSE",
    "decimals": 18
  },
  "infoURL": "https://fuse.io/",
  "shortName": "fuse",
  "chainId": 122,
  "networkId": 122,
  "icon": {
    "url": "ipfs://QmQg8aqyeaMfHvjzFDtZkb8dUNRYhFezPp8UYVc1HnLpRW/green.png",
    "format": "png",
    "width": 512,
    "height": 512
  },
  "testnet": false,
  "slug": "fuse"
} as const;