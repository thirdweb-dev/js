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
  "infoURL": "https://pepe-chain.vip",
  "name": "Pepe Chain Mainnet",
  "nativeCurrency": {
    "name": "Pepe",
    "symbol": "PEPE",
    "decimals": 18
  },
  "networkId": 411,
  "rpc": [
    "https://411.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.pepe-chain.vip"
  ],
  "shortName": "pepe",
  "slug": "pepe-chain",
  "status": "active",
  "testnet": false
} as const satisfies Chain;