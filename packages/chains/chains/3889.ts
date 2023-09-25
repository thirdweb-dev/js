import type { Chain } from "../src/types";
export default {
  "chainId": 3889,
  "chain": "KLC",
  "name": "KalyChain Testnet",
  "rpc": [
    "https://kalychain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnetrpc.kalychain.io/rpc"
  ],
  "slug": "kalychain-testnet",
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
  "shortName": "kalytestnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "KalyScan",
      "url": "https://testnet.kalyscan.io",
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