export default {
  "name": "BlockChain Station Mainnet",
  "chain": "BCS",
  "rpc": [
    "https://rpc-mainnet.bcsdev.io",
    "wss://rpc-ws-mainnet.bcsdev.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BCS Token",
    "symbol": "BCS",
    "decimals": 18
  },
  "infoURL": "https://blockchainstation.io",
  "shortName": "bcs",
  "chainId": 707,
  "networkId": 707,
  "explorers": [
    {
      "name": "BlockChain Station Explorer",
      "url": "https://explorer.bcsdev.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "blockchain-station"
} as const;