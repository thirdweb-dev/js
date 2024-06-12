import type { Chain } from "../src/types";
export default {
  "chain": "Xai Sepolia",
  "chainId": 37714555429,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://testnet-explorer-v2.xai-chain.net",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmbWFbhjKw7zfsK5Rd9YxZgJgS43fpySPozjhYc98ibbEV/xai-icon.png",
    "width": 1024,
    "height": 1024,
    "format": "png"
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
    "https://37714555429.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-v2.xai-chain.net/rpc"
  ],
  "shortName": "xai-sepolia",
  "slug": "xai-sepolia",
  "testnet": true
} as const satisfies Chain;