import type { Chain } from "../src/types";
export default {
  "chain": "AIE",
  "chainId": 413413,
  "explorers": [
    {
      "name": "aiescan-testnet",
      "url": "https://testnet.aiescan.io",
      "standard": "none",
      "icon": {
        "url": "ipfs://bafkreihok46mhn5yf7b5jgmq7tiyw2fw76wklvj4frpc3gbswgfxzerhhm",
        "width": 3481,
        "height": 3500,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreihok46mhn5yf7b5jgmq7tiyw2fw76wklvj4frpc3gbswgfxzerhhm",
    "width": 3481,
    "height": 3500,
    "format": "png"
  },
  "infoURL": "https://testnet.aiescan.io",
  "name": "AIE Testnet",
  "nativeCurrency": {
    "name": "AIE",
    "symbol": "tAIE",
    "decimals": 18
  },
  "networkId": 413413,
  "rpc": [
    "https://413413.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1-testnet.aiechain.io"
  ],
  "shortName": "aiet",
  "slug": "aie-testnet",
  "testnet": true
} as const satisfies Chain;