export default {
  "name": "Tao Network",
  "chain": "TAO",
  "rpc": [
    "https://tao-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.tao.network",
    "http://rpc.testnet.tao.network:8545",
    "https://rpc.tao.network",
    "wss://rpc.tao.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Tao",
    "symbol": "TAO",
    "decimals": 18
  },
  "infoURL": "https://tao.network",
  "shortName": "tao",
  "chainId": 558,
  "networkId": 558,
  "testnet": true,
  "slug": "tao-network"
} as const;