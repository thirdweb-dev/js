export default {
  "name": "Shardeum Liberty 1.X",
  "chain": "Shardeum",
  "icon": {
    "url": "ipfs://Qma1bfuubpepKn7DLDy4NPSKDeT3S4VPCNhu6UmdGrb6YD",
    "width": 609,
    "height": 533,
    "format": "png"
  },
  "rpc": [
    "https://shardeum-liberty-1-x.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://liberty10.shardeum.org/"
  ],
  "faucets": [
    "https://faucet.liberty10.shardeum.org"
  ],
  "nativeCurrency": {
    "name": "Shardeum SHM",
    "symbol": "SHM",
    "decimals": 18
  },
  "infoURL": "https://docs.shardeum.org/",
  "shortName": "Liberty10",
  "chainId": 8080,
  "networkId": 8080,
  "explorers": [
    {
      "name": "Shardeum Scan",
      "url": "https://explorer-liberty10.shardeum.org",
      "standard": "none"
    }
  ],
  "redFlags": [
    "reusedChainId"
  ],
  "testnet": false,
  "slug": "shardeum-liberty-1-x"
} as const;