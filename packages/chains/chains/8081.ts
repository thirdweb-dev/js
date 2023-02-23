export default {
  "name": "Shardeum Liberty 2.X",
  "chain": "Shardeum",
  "icon": {
    "url": "ipfs://Qma1bfuubpepKn7DLDy4NPSKDeT3S4VPCNhu6UmdGrb6YD",
    "width": 609,
    "height": 533,
    "format": "png"
  },
  "rpc": [
    "https://shardeum-liberty-2-x.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://liberty20.shardeum.org/"
  ],
  "faucets": [
    "https://faucet.liberty20.shardeum.org"
  ],
  "nativeCurrency": {
    "name": "Shardeum SHM",
    "symbol": "SHM",
    "decimals": 18
  },
  "infoURL": "https://docs.shardeum.org/",
  "shortName": "Liberty20",
  "chainId": 8081,
  "networkId": 8081,
  "explorers": [
    {
      "name": "Shardeum Scan",
      "url": "https://explorer-liberty20.shardeum.org",
      "standard": "none"
    }
  ],
  "redFlags": [
    "reusedChainId"
  ],
  "testnet": false,
  "slug": "shardeum-liberty-2-x"
} as const;