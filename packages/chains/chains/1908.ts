export default {
  "name": "Bitcichain Testnet",
  "chain": "TBITCI",
  "icon": {
    "url": "ipfs://QmbxmfWw5sVMASz5EbR1DCgLfk8PnqpSJGQKpYuEUpoxqn",
    "width": 64,
    "height": 64,
    "format": "svg"
  },
  "rpc": [
    "https://bitcichain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.bitcichain.com"
  ],
  "faucets": [
    "https://faucet.bitcichain.com"
  ],
  "nativeCurrency": {
    "name": "Test Bitci",
    "symbol": "TBITCI",
    "decimals": 18
  },
  "infoURL": "https://www.bitcichain.com",
  "shortName": "tbitci",
  "chainId": 1908,
  "networkId": 1908,
  "explorers": [
    {
      "name": "Bitci Explorer Testnet",
      "url": "https://testnet.bitciexplorer.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "bitcichain-testnet"
} as const;