export default {
  "name": "EZChain C-Chain Testnet",
  "chain": "EZC",
  "rpc": [
    "https://testnet-api.ezchain.com/ext/bc/C/rpc"
  ],
  "faucets": [
    "https://testnet-faucet.ezchain.com"
  ],
  "nativeCurrency": {
    "name": "EZChain",
    "symbol": "EZC",
    "decimals": 18
  },
  "infoURL": "https://ezchain.com",
  "shortName": "Fuji-EZChain",
  "chainId": 2613,
  "networkId": 2613,
  "icon": {
    "url": "ipfs://QmPKJbYCFjGmY9X2cA4b9YQjWYHQncmKnFtKyQh9rHkFTb",
    "width": 146,
    "height": 48,
    "format": "png"
  },
  "explorers": [
    {
      "name": "ezchain",
      "url": "https://testnet-cchain-explorer.ezchain.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "ezchain-c-chain-testnet"
} as const;