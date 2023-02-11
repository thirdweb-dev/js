export default {
  "name": "KardiaChain Mainnet",
  "chain": "KAI",
  "icon": {
    "url": "ipfs://QmXoHaZXJevc59GuzEgBhwRSH6kio1agMRvL8bD93pARRV",
    "format": "png",
    "width": 297,
    "height": 297
  },
  "rpc": [
    "https://kardiachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.kardiachain.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "KardiaChain",
    "symbol": "KAI",
    "decimals": 18
  },
  "infoURL": "https://kardiachain.io",
  "shortName": "kardiachain",
  "chainId": 24,
  "networkId": 0,
  "redFlags": [
    "reusedChainId"
  ],
  "testnet": false,
  "slug": "kardiachain"
} as const;