export default {
  "name": "Bitcichain Mainnet",
  "chain": "BITCI",
  "icon": {
    "url": "ipfs://QmbxmfWw5sVMASz5EbR1DCgLfk8PnqpSJGQKpYuEUpoxqn",
    "width": 64,
    "height": 64,
    "format": "svg"
  },
  "rpc": [
    "https://bitcichain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.bitci.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Bitci",
    "symbol": "BITCI",
    "decimals": 18
  },
  "infoURL": "https://www.bitcichain.com",
  "shortName": "bitci",
  "chainId": 1907,
  "networkId": 1907,
  "explorers": [
    {
      "name": "Bitci Explorer",
      "url": "https://bitciexplorer.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "bitcichain"
} as const;