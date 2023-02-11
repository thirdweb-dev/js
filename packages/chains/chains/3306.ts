export default {
  "name": "Debounce Subnet Testnet",
  "chain": "Debounce Network",
  "icon": {
    "url": "ipfs://bafybeib5q4hez37s7b2fx4hqt2q4ji2tuudxjhfdgnp6q3d5mqm6wsxdfq",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "rpc": [
    "https://debounce-subnet-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dev-rpc.debounce.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Debounce Network",
    "symbol": "DB",
    "decimals": 18
  },
  "infoURL": "https://debounce.network",
  "shortName": "debounce-devnet",
  "chainId": 3306,
  "networkId": 3306,
  "explorers": [
    {
      "name": "Debounce Devnet Explorer",
      "url": "https://explorer.debounce.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "debounce-subnet-testnet"
} as const;