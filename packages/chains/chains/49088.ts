export default {
  "name": "Bifrost Testnet",
  "title": "The Bifrost Testnet network",
  "chain": "BFC",
  "rpc": [
    "https://bifrost-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://public-01.testnet.thebifrost.io/rpc",
    "https://public-02.testnet.thebifrost.io/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bifrost",
    "symbol": "BFC",
    "decimals": 18
  },
  "infoURL": "https://thebifrost.io",
  "shortName": "tbfc",
  "chainId": 49088,
  "networkId": 49088,
  "icon": {
    "url": "ipfs://QmcHvn2Wq91ULyEH5s3uHjosX285hUgyJHwggFJUd3L5uh",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "explorers": [
    {
      "name": "explorer-thebifrost",
      "url": "https://explorer.testnet.thebifrost.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "bifrost-testnet"
} as const;