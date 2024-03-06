import type { Chain } from "../src/types";
export default {
  "chain": "Xai Mainnet",
  "chainId": 660279,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmZKFekbHxDkB8gFmmmjWz89SLhwg38GkALmAKo3gn753N/2024-01-10%2012.50.15.jpg",
    "width": 512,
    "height": 512,
    "format": "jpg"
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
    "https://xai-chain.net/rpc/xai79df8614da076af58f199126a07db"
  ],
  "shortName": "xai",
  "slug": "xai",
  "testnet": false
} as const satisfies Chain;