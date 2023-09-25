import type { Chain } from "../src/types";
export default {
  "chainId": 2613,
  "chain": "EZC",
  "name": "EZChain C-Chain Testnet",
  "rpc": [
    "https://ezchain-c-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-api.ezchain.com/ext/bc/C/rpc"
  ],
  "slug": "ezchain-c-chain-testnet",
  "icon": {
    "url": "ipfs://QmPKJbYCFjGmY9X2cA4b9YQjWYHQncmKnFtKyQh9rHkFTb",
    "width": 146,
    "height": 48,
    "format": "png"
  },
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
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "ezchain",
      "url": "https://testnet-cchain-explorer.ezchain.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;