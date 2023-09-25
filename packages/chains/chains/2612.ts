import type { Chain } from "../src/types";
export default {
  "chainId": 2612,
  "chain": "EZC",
  "name": "EZChain C-Chain Mainnet",
  "rpc": [
    "https://ezchain-c-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.ezchain.com/ext/bc/C/rpc"
  ],
  "slug": "ezchain-c-chain",
  "icon": {
    "url": "ipfs://QmPKJbYCFjGmY9X2cA4b9YQjWYHQncmKnFtKyQh9rHkFTb",
    "width": 146,
    "height": 48,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "EZChain",
    "symbol": "EZC",
    "decimals": 18
  },
  "infoURL": "https://ezchain.com",
  "shortName": "EZChain",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "ezchain",
      "url": "https://cchain-explorer.ezchain.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;