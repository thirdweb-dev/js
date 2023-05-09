import type { Chain } from "../src/types";
export default {
  "name": "Tenet Testnet",
  "title": "Tenet Testnet",
  "chain": "TENET",
  "icon": {
    "url": "ipfs://Qmc1gqjWTzNo4pyFSGtQuCu7kRSZZBUVybtTjHn2nNEEPA",
    "width": 640,
    "height": 640,
    "format": "svg"
  },
  "rpc": [
    "https://tenet-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.tenet.org"
  ],
  "faucets": [
    "https://faucet.testnet.tenet.org"
  ],
  "nativeCurrency": {
    "name": "TENET",
    "symbol": "TENET",
    "decimals": 18
  },
  "infoURL": "https://tenet.org/",
  "shortName": "tenet-testnet",
  "chainId": 155,
  "networkId": 155,
  "explorers": [
    {
      "name": "TenetScan Testnet",
      "url": "https://testnet.tenetscan.io",
      "icon": {
        "url": "ipfs://Qmc1gqjWTzNo4pyFSGtQuCu7kRSZZBUVybtTjHn2nNEEPA",
        "width": 640,
        "height": 640,
        "format": "svg"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "tenet-testnet"
} as const satisfies Chain;