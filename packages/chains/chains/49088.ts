export default {
  "name": "Bifrost Testnet1",
  "title": "The Bifrost Testnet network",
  "chain": "BFC",
  "rpc": [
    "https://public-01.testnet.thebifrost.io/rpc",
    "https://public-02.testnet.thebifrost.io/rpc",
    "https://private.chain.thebifrost.io/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bifrost",
    "symbol": "BFC",
    "decimals": 18
  },
  "infoURL": "https://testnet.thebifrost.io",
  "shortName": "BIT",
  "chainId": 49088,
  "networkId": 49088,
  "explorers": [
    {
      "name": "explorer-thebifrost",
      "url": "https://explorer.testnet.thebifrost.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "bifrost-testnet1"
} as const;