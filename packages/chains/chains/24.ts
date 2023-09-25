import type { Chain } from "../src/types";
export default {
  "chainId": 24,
  "chain": "KAI",
  "name": "KardiaChain Mainnet",
  "rpc": [
    "https://kardiachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.kardiachain.io"
  ],
  "slug": "kardiachain",
  "icon": {
    "url": "ipfs://QmXoHaZXJevc59GuzEgBhwRSH6kio1agMRvL8bD93pARRV",
    "width": 297,
    "height": 297,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "KardiaChain",
    "symbol": "KAI",
    "decimals": 18
  },
  "infoURL": "https://kardiachain.io",
  "shortName": "kardiachain",
  "testnet": false,
  "redFlags": [
    "reusedChainId"
  ],
  "explorers": [],
  "features": []
} as const satisfies Chain;