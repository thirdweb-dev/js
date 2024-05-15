import type { Chain } from "../src/types";
export default {
  "chain": "TENET",
  "chainId": 1559,
  "explorers": [
    {
      "name": "TenetScan Mainnet",
      "url": "https://tenetscan.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://Qmc1gqjWTzNo4pyFSGtQuCu7kRSZZBUVybtTjHn2nNEEPA",
        "width": 640,
        "height": 640,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://Qmc1gqjWTzNo4pyFSGtQuCu7kRSZZBUVybtTjHn2nNEEPA",
    "width": 640,
    "height": 640,
    "format": "svg"
  },
  "infoURL": "https://tenet.org/",
  "name": "Tenet",
  "nativeCurrency": {
    "name": "TENET",
    "symbol": "TENET",
    "decimals": 18
  },
  "networkId": 1559,
  "rpc": [
    "https://1559.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tenet.org",
    "https://tenet-evm.publicnode.com",
    "wss://tenet-evm.publicnode.com"
  ],
  "shortName": "tenet",
  "slug": "tenet",
  "testnet": false,
  "title": "Tenet Mainnet"
} as const satisfies Chain;