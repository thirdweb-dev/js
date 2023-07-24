import type { Chain } from "../src/types";
export default {
  "name": "Pepe Chain Mainnet",
  "chain": "PC",
  "status": "active",
  "icon": {
    "url": "ipfs://bafkreibjsc3gww3moti27za2hpyq552aevux3yv5y2ntdklksyr4v4uavy",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "rpc": [
    "https://pepe-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.pepe-chain.vip"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Pepe",
    "symbol": "PEPE",
    "decimals": 18
  },
  "infoURL": "https://pepe-chain.vip",
  "shortName": "pepe",
  "chainId": 411,
  "networkId": 411,
  "explorers": [
    {
      "name": "pepechain explorer",
      "url": "https://explorer.pepe-chain.vip",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "pepe-chain"
} as const satisfies Chain;