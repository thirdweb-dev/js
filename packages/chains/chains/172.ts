export default {
  "name": "Latam-Blockchain Resil Testnet",
  "chain": "Resil",
  "rpc": [
    "https://latam-blockchain-resil-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.latam-blockchain.com",
    "wss://ws.latam-blockchain.com"
  ],
  "faucets": [
    "https://faucet.latam-blockchain.com"
  ],
  "nativeCurrency": {
    "name": "Latam-Blockchain Resil Test Native Token",
    "symbol": "usd",
    "decimals": 18
  },
  "infoURL": "https://latam-blockchain.com",
  "shortName": "resil",
  "chainId": 172,
  "networkId": 172,
  "testnet": true,
  "slug": "latam-blockchain-resil-testnet"
} as const;