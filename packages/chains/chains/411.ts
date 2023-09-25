import type { Chain } from "../src/types";
export default {
  "chainId": 411,
  "chain": "PC",
  "name": "Pepe Chain Mainnet",
  "rpc": [
    "https://pepe-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.pepe-chain.vip"
  ],
  "slug": "pepe-chain",
  "icon": {
    "url": "ipfs://bafkreibjsc3gww3moti27za2hpyq552aevux3yv5y2ntdklksyr4v4uavy",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Pepe",
    "symbol": "PEPE",
    "decimals": 18
  },
  "infoURL": "https://pepe-chain.vip",
  "shortName": "pepe",
  "testnet": false,
  "status": "active",
  "redFlags": [],
  "explorers": [
    {
      "name": "pepechain explorer",
      "url": "https://explorer.pepe-chain.vip",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;