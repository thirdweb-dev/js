import type { Chain } from "../src/types";
export default {
  "name": "KalyChain Mainnet",
  "chain": "KLC",
  "icon": {
    "url": "ipfs://QmUaXcPewLuQtY5a7xPTzJyVdjkH487VfV7gSR8UXrbxQ3",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "rpc": [
    "https://kalychain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.kalychain.io/rpc"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "KalyCoin",
    "symbol": "KLC",
    "decimals": 18
  },
  "infoURL": "https://kalychain.io",
  "shortName": "kalymainnet",
  "chainId": 3888,
  "networkId": 3888,
  "explorers": [
    {
      "name": "KalyScan",
      "url": "https://kalyscan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "kalychain"
} as const satisfies Chain;