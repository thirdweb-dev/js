import type { Chain } from "../src/types";
export default {
  "chainId": 155,
  "chain": "TENET",
  "name": "Tenet Testnet",
  "rpc": [
    "https://tenet-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.tenet.org"
  ],
  "slug": "tenet-testnet",
  "icon": {
    "url": "ipfs://Qmc1gqjWTzNo4pyFSGtQuCu7kRSZZBUVybtTjHn2nNEEPA",
    "width": 640,
    "height": 640,
    "format": "svg"
  },
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
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "TenetScan Testnet",
      "url": "https://testnet.tenetscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;