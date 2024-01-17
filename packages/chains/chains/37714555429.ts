import type { Chain } from "../src/types";
export default {
  "chain": "Xai Sepolia",
  "chainId": 37714555429,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet-explorer-v2.xai-chain.net/",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmZKFekbHxDkB8gFmmmjWz89SLhwg38GkALmAKo3gn753N/2024-01-10%2012.50.15.jpg",
    "width": 512,
    "height": 512,
    "format": "jpg"
  },
  "infoURL": "https://xai.games",
  "name": "Xai Sepolia",
  "nativeCurrency": {
    "name": "sXAI",
    "symbol": "sXAI",
    "decimals": 18
  },
  "networkId": 37714555429,
  "parent": {
    "type": "L3",
    "chain": "eip155-1",
    "bridges": []
  },
  "redFlags": [],
  "rpc": [
    "https://xai-sepolia.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://37714555429.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-v2.xai-chain.net/rpc"
  ],
  "shortName": "xai-sepolia",
  "slug": "xai-sepolia",
  "testnet": true
} as const satisfies Chain;