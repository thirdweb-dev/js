export default {
  "name": "ZCore Testnet",
  "chain": "Beach",
  "icon": {
    "url": "ipfs://QmQnXu13ym8W1VA3QxocaNVXGAuEPmamSCkS7bBscVk1f4",
    "width": 1050,
    "height": 1050,
    "format": "png"
  },
  "rpc": [
    "https://zcore-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.zcore.cash"
  ],
  "faucets": [
    "https://faucet.zcore.cash"
  ],
  "nativeCurrency": {
    "name": "ZCore",
    "symbol": "ZCR",
    "decimals": 18
  },
  "infoURL": "https://zcore.cash",
  "shortName": "zcrbeach",
  "chainId": 3331,
  "networkId": 3331,
  "testnet": true,
  "slug": "zcore-testnet"
} as const;