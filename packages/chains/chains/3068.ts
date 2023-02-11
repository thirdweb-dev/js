export default {
  "name": "Bifrost Mainnet",
  "title": "The Bifrost Mainnet network",
  "chain": "BFC",
  "rpc": [
    "https://bifrost.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://public-01.mainnet.thebifrost.io/rpc",
    "https://public-02.mainnet.thebifrost.io/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bifrost",
    "symbol": "BFC",
    "decimals": 18
  },
  "infoURL": "https://thebifrost.io",
  "shortName": "bfc",
  "chainId": 3068,
  "networkId": 3068,
  "icon": {
    "url": "ipfs://QmcHvn2Wq91ULyEH5s3uHjosX285hUgyJHwggFJUd3L5uh",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "explorers": [
    {
      "name": "explorer-thebifrost",
      "url": "https://explorer.mainnet.thebifrost.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "bifrost"
} as const;