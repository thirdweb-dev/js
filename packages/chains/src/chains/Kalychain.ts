import type { Chain } from "../types";
export default {
  "chain": "KLC",
  "chainId": 3888,
  "explorers": [
    {
      "name": "KalyScan",
      "url": "https://kalyscan.io",
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
  "name": "KalyChain Mainnet",
  "nativeCurrency": {
    "name": "KalyCoin",
    "symbol": "KLC",
    "decimals": 18
  },
  "networkId": 3888,
  "rpc": [
    "https://kalychain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://3888.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.kalychain.io/rpc"
  ],
  "shortName": "kalymainnet",
  "slug": "kalychain",
  "testnet": false
} as const satisfies Chain;