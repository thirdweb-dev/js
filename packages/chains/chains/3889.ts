import type { Chain } from "../src/types";
export default {
  "name": "KalyChain Testnet",
  "chain": "KLC",
  "icon": {
    "url": "ipfs://QmUaXcPewLuQtY5a7xPTzJyVdjkH487VfV7gSR8UXrbxQ3",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "rpc": [
    "https://kalychain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnetrpc.kalychain.io/rpc"
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
  "shortName": "kalytestnet",
  "chainId": 3889,
  "networkId": 3889,
  "explorers": [
    {
      "name": "KalyScan",
      "url": "https://testnet.kalyscan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "kalychain-testnet"
} as const satisfies Chain;