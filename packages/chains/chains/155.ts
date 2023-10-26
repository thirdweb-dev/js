import type { Chain } from "../src/types";
export default {
  "chain": "TENET",
  "chainId": 155,
  "explorers": [
    {
      "name": "TenetScan Testnet",
      "url": "https://testnet.tenetscan.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://Qmc1gqjWTzNo4pyFSGtQuCu7kRSZZBUVybtTjHn2nNEEPA",
        "width": 640,
        "height": 640,
        "format": "svg"
      }
    }
  ],
  "faucets": [
    "https://faucet.testnet.tenet.org"
  ],
  "icon": {
    "url": "ipfs://Qmc1gqjWTzNo4pyFSGtQuCu7kRSZZBUVybtTjHn2nNEEPA",
    "width": 640,
    "height": 640,
    "format": "svg"
  },
  "infoURL": "https://tenet.org/",
  "name": "Tenet Testnet",
  "nativeCurrency": {
    "name": "TENET",
    "symbol": "TENET",
    "decimals": 18
  },
  "networkId": 155,
  "rpc": [
    "https://tenet-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://155.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.tenet.org"
  ],
  "shortName": "tenet-testnet",
  "slug": "tenet-testnet",
  "testnet": true,
  "title": "Tenet Testnet"
} as const satisfies Chain;