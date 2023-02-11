export default {
  "name": "Taycan Testnet",
  "chain": "Taycan",
  "rpc": [
    "https://taycan-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test-taycan.hupayx.io"
  ],
  "faucets": [
    "https://ttaycan-faucet.hupayx.io/"
  ],
  "nativeCurrency": {
    "name": "test-Shuffle",
    "symbol": "tSFL",
    "decimals": 18
  },
  "infoURL": "https://hupayx.io",
  "shortName": "taycan-testnet",
  "chainId": 2023,
  "networkId": 2023,
  "icon": {
    "url": "ipfs://bafkreidvjcc73v747lqlyrhgbnkvkdepdvepo6baj6hmjsmjtvdyhmzzmq",
    "width": 1000,
    "height": 1206,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Taycan Explorer(Blockscout)",
      "url": "https://evmscan-test.hupayx.io",
      "standard": "none",
      "icon": "shuffle"
    },
    {
      "name": "Taycan Cosmos Explorer",
      "url": "https://cosmoscan-test.hupayx.io",
      "standard": "none",
      "icon": "shuffle"
    }
  ],
  "testnet": true,
  "slug": "taycan-testnet"
} as const;