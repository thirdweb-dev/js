import type { Chain } from "../types";
export default {
  "chain": "EZC",
  "chainId": 2613,
  "explorers": [
    {
      "name": "ezchain",
      "url": "https://testnet-cchain-explorer.ezchain.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://testnet-faucet.ezchain.com"
  ],
  "icon": {
    "url": "ipfs://QmPKJbYCFjGmY9X2cA4b9YQjWYHQncmKnFtKyQh9rHkFTb",
    "width": 146,
    "height": 48,
    "format": "png"
  },
  "infoURL": "https://ezchain.com",
  "name": "EZChain C-Chain Testnet",
  "nativeCurrency": {
    "name": "EZChain",
    "symbol": "EZC",
    "decimals": 18
  },
  "networkId": 2613,
  "rpc": [
    "https://ezchain-c-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2613.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-api.ezchain.com/ext/bc/C/rpc"
  ],
  "shortName": "Fuji-EZChain",
  "slug": "ezchain-c-chain-testnet",
  "testnet": true
} as const satisfies Chain;