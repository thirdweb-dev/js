export default {
  "name": "Shardeum Sphinx 1.X",
  "chain": "Shardeum",
  "icon": {
    "url": "ipfs://Qma1bfuubpepKn7DLDy4NPSKDeT3S4VPCNhu6UmdGrb6YD",
    "width": 609,
    "height": 533,
    "format": "png"
  },
  "rpc": [
    "https://shardeum-sphinx-1-x.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sphinx.shardeum.org/"
  ],
  "faucets": [
    "https://faucet-sphinx.shardeum.org/"
  ],
  "nativeCurrency": {
    "name": "Shardeum SHM",
    "symbol": "SHM",
    "decimals": 18
  },
  "infoURL": "https://docs.shardeum.org/",
  "shortName": "Sphinx10",
  "chainId": 8082,
  "networkId": 8082,
  "explorers": [
    {
      "name": "Shardeum Scan",
      "url": "https://explorer-sphinx.shardeum.org",
      "standard": "none"
    }
  ],
  "redFlags": [
    "reusedChainId"
  ],
  "testnet": false,
  "slug": "shardeum-sphinx-1-x"
} as const;