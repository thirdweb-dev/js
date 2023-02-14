export default {
  "name": "BlockChain Station Testnet",
  "chain": "BCS",
  "rpc": [
    "https://blockchain-station-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.bcsdev.io",
    "wss://rpc-ws-testnet.bcsdev.io"
  ],
  "faucets": [
    "https://faucet.bcsdev.io"
  ],
  "nativeCurrency": {
    "name": "BCS Testnet Token",
    "symbol": "tBCS",
    "decimals": 18
  },
  "infoURL": "https://blockchainstation.io",
  "shortName": "tbcs",
  "chainId": 708,
  "networkId": 708,
  "explorers": [
    {
      "name": "BlockChain Station Explorer",
      "url": "https://testnet.bcsdev.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "blockchain-station-testnet"
} as const;