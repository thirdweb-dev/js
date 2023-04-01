import type { Chain } from "../src/types";
export default {
  "name": "EZChain C-Chain Mainnet",
  "chain": "EZC",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "EZChain",
    "symbol": "EZC",
    "decimals": 18
  },
  "infoURL": "https://ezchain.com",
  "shortName": "EZChain",
  "chainId": 2612,
  "networkId": 2612,
  "icon": {
    "url": "ipfs://QmPKJbYCFjGmY9X2cA4b9YQjWYHQncmKnFtKyQh9rHkFTb",
    "width": 146,
    "height": 48,
    "format": "png"
  },
  "explorers": [
    {
      "name": "ezchain",
      "url": "https://cchain-explorer.ezchain.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "ezchain-c-chain"
} as const satisfies Chain;