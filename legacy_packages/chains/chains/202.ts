import type { Chain } from "../src/types";
export default {
  "chain": "EdgelessTestnet",
  "chainId": 202,
  "explorers": [
    {
      "name": "Edgeless Explorer",
      "url": "https://testnet.explorer.edgeless.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "infoURL": "https://edgeless.network",
  "name": "Edgeless Testnet",
  "nativeCurrency": {
    "name": "Edgeless Wrapped Eth",
    "symbol": "EwEth",
    "decimals": 18
  },
  "networkId": 202,
  "rpc": [
    "https://202.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.rpc.edgeless.network/http"
  ],
  "shortName": "edgeless-testnet",
  "slug": "edgeless-testnet",
  "testnet": true
} as const satisfies Chain;