export default {
  "name": "Taycan",
  "chain": "Taycan",
  "rpc": [
    "https://taycan.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://taycan-rpc.hupayx.io:8545"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "shuffle",
    "symbol": "SFL",
    "decimals": 18
  },
  "infoURL": "https://hupayx.io",
  "shortName": "SFL",
  "chainId": 22023,
  "networkId": 22023,
  "icon": {
    "url": "ipfs://bafkreidvjcc73v747lqlyrhgbnkvkdepdvepo6baj6hmjsmjtvdyhmzzmq",
    "width": 1000,
    "height": 1206,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Taycan Explorer(Blockscout)",
      "url": "https://taycan-evmscan.hupayx.io",
      "standard": "none",
      "icon": "shuffle"
    },
    {
      "name": "Taycan Cosmos Explorer(BigDipper)",
      "url": "https://taycan-cosmoscan.hupayx.io",
      "standard": "none",
      "icon": "shuffle"
    }
  ],
  "testnet": false,
  "slug": "taycan"
} as const;