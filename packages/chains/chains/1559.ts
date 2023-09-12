import type { Chain } from "../src/types";
export default {
  "name": "Tenet",
  "title": "Tenet Mainnet",
  "chain": "TENET",
  "icon": {
    "url": "ipfs://Qmc1gqjWTzNo4pyFSGtQuCu7kRSZZBUVybtTjHn2nNEEPA",
    "width": 640,
    "height": 640,
    "format": "svg"
  },
  "rpc": [
    "https://tenet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tenet.org",
    "https://tenet-evm.publicnode.com",
    "wss://tenet-evm.publicnode.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "TENET",
    "symbol": "TENET",
    "decimals": 18
  },
  "infoURL": "https://tenet.org/",
  "shortName": "tenet",
  "chainId": 1559,
  "networkId": 1559,
  "explorers": [
    {
      "name": "TenetScan Mainnet",
      "url": "https://tenetscan.io",
      "icon": {
        "url": "ipfs://Qmc1gqjWTzNo4pyFSGtQuCu7kRSZZBUVybtTjHn2nNEEPA",
        "width": 640,
        "height": 640,
        "format": "svg"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "tenet"
} as const satisfies Chain;