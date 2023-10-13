import type { Chain } from "../src/types";
export default {
  "chain": "PC",
  "chainId": 411,
  "explorers": [
    {
      "name": "pepechain explorer",
      "url": "https://explorer.pepe-chain.vip",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://bafkreibjsc3gww3moti27za2hpyq552aevux3yv5y2ntdklksyr4v4uavy",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://pepe-chain.vip",
  "name": "Pepe Chain Mainnet",
  "nativeCurrency": {
    "name": "Pepe",
    "symbol": "PEPE",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://pepe-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.pepe-chain.vip"
  ],
  "shortName": "pepe",
  "slug": "pepe-chain",
  "status": "active",
  "testnet": false
} as const satisfies Chain;