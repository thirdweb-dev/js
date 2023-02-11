export default {
  "name": "SeedCoin-Network",
  "chain": "SeedCoin-Network",
  "rpc": [
    "https://seedcoin-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node.seedcoin.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "SeedCoin",
    "symbol": "SEED",
    "decimals": 18
  },
  "infoURL": "https://www.seedcoin.network/",
  "shortName": "SEED",
  "icon": {
    "url": "ipfs://QmSchLvCCZjBzcv5n22v1oFDAc2yHJ42NERyjZeL9hBgrh",
    "width": 64,
    "height": 64,
    "format": "png"
  },
  "chainId": 37,
  "networkId": 37,
  "testnet": false,
  "slug": "seedcoin-network"
} as const;