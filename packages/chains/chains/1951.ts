export default {
  "name": "D-Chain Mainnet",
  "chain": "D-Chain",
  "rpc": [
    "https://d-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.d-chain.network/ext/bc/2ZiR1Bro5E59siVuwdNuRFzqL95NkvkbzyLBdrsYR9BLSHV7H4/rpc"
  ],
  "nativeCurrency": {
    "name": "DOINX",
    "symbol": "DOINX",
    "decimals": 18
  },
  "shortName": "dchain-mainnet",
  "chainId": 1951,
  "networkId": 1951,
  "icon": {
    "url": "ipfs://QmV2vhTqS9UyrX9Q6BSCbK4JrKBnS8ErHvstMjfb2oVWaj",
    "width": 700,
    "height": 495,
    "format": "png"
  },
  "faucets": [],
  "infoURL": "",
  "testnet": false,
  "slug": "d-chain"
} as const;