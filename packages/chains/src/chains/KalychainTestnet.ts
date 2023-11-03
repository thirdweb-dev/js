import type { Chain } from "../types";
export default {
  "chain": "KLC",
  "chainId": 3889,
  "explorers": [
    {
      "name": "KalyScan",
      "url": "https://testnet.kalyscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmUaXcPewLuQtY5a7xPTzJyVdjkH487VfV7gSR8UXrbxQ3",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://kalychain.io",
  "name": "KalyChain Testnet",
  "nativeCurrency": {
    "name": "KalyCoin",
    "symbol": "KLC",
    "decimals": 18
  },
  "networkId": 3889,
  "rpc": [
    "https://kalychain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://3889.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnetrpc.kalychain.io/rpc"
  ],
  "shortName": "kalytestnet",
  "slug": "kalychain-testnet",
  "testnet": true
} as const satisfies Chain;