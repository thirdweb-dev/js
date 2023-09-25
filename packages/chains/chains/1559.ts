import type { Chain } from "../src/types";
export default {
  "chainId": 1559,
  "chain": "TENET",
  "name": "Tenet",
  "rpc": [
    "https://tenet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tenet.org",
    "https://tenet-evm.publicnode.com",
    "wss://tenet-evm.publicnode.com"
  ],
  "slug": "tenet",
  "icon": {
    "url": "ipfs://Qmc1gqjWTzNo4pyFSGtQuCu7kRSZZBUVybtTjHn2nNEEPA",
    "width": 640,
    "height": 640,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "TENET",
    "symbol": "TENET",
    "decimals": 18
  },
  "infoURL": "https://tenet.org/",
  "shortName": "tenet",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "TenetScan Mainnet",
      "url": "https://tenetscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;