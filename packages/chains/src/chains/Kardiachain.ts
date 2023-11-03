import type { Chain } from "../types";
export default {
  "chain": "KAI",
  "chainId": 24,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmXoHaZXJevc59GuzEgBhwRSH6kio1agMRvL8bD93pARRV",
    "width": 297,
    "height": 297,
    "format": "png"
  },
  "infoURL": "https://kardiachain.io",
  "name": "KardiaChain Mainnet",
  "nativeCurrency": {
    "name": "KardiaChain",
    "symbol": "KAI",
    "decimals": 18
  },
  "networkId": 0,
  "redFlags": [
    "reusedChainId"
  ],
  "rpc": [
    "https://kardiachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://24.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.kardiachain.io"
  ],
  "shortName": "kardiachain",
  "slug": "kardiachain",
  "testnet": false
} as const satisfies Chain;