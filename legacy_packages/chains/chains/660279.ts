import type { Chain } from "../src/types";
export default {
  "chain": "Xai Mainnet",
  "chainId": 660279,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer.xai-chain.net",
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
  "infoURL": "https://xai.games/",
  "name": "Xai Mainnet",
  "nativeCurrency": {
    "name": "XAI token",
    "symbol": "XAI",
    "decimals": 18
  },
  "networkId": 660279,
  "redFlags": [],
  "rpc": [
    "https://660279.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://xai-chain.net/rpc/xai79df8614da076af58f199126a07db",
    "https://xai-chain.net/rpc"
  ],
  "shortName": "xai",
  "slug": "xai",
  "testnet": false
} as const satisfies Chain;