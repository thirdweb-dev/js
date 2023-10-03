import type { Chain } from "../src/types";
export default {
  "chain": "EZC",
  "chainId": 2612,
  "explorers": [
    {
      "name": "ezchain",
      "url": "https://cchain-explorer.ezchain.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmPKJbYCFjGmY9X2cA4b9YQjWYHQncmKnFtKyQh9rHkFTb",
    "width": 146,
    "height": 48,
    "format": "png"
  },
  "infoURL": "https://ezchain.com",
  "name": "EZChain C-Chain Mainnet",
  "nativeCurrency": {
    "name": "EZChain",
    "symbol": "EZC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://ezchain-c-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.ezchain.com/ext/bc/C/rpc"
  ],
  "shortName": "EZChain",
  "slug": "ezchain-c-chain",
  "testnet": false
} as const satisfies Chain;