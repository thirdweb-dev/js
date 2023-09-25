import type { Chain } from "../src/types";
export default {
  "chainId": 3888,
  "chain": "KLC",
  "name": "KalyChain Mainnet",
  "rpc": [
    "https://kalychain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.kalychain.io/rpc"
  ],
  "slug": "kalychain",
  "icon": {
    "url": "ipfs://QmUaXcPewLuQtY5a7xPTzJyVdjkH487VfV7gSR8UXrbxQ3",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "KalyCoin",
    "symbol": "KLC",
    "decimals": 18
  },
  "infoURL": "https://kalychain.io",
  "shortName": "kalymainnet",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "KalyScan",
      "url": "https://kalyscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;