import type { Chain } from "../src/types";
export default {
  "chain": "Edgeless",
  "chainId": 2026,
  "explorers": [
    {
      "name": "Edgeless Explorer",
      "url": "https://explorer.edgeless.network",
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
  "name": "Edgeless Network",
  "nativeCurrency": {
    "name": "Edgeless Wrapped Eth",
    "symbol": "EwEth",
    "decimals": 18
  },
  "networkId": 2026,
  "rpc": [
    "https://2026.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.edgeless.network/http"
  ],
  "shortName": "edgeless",
  "slug": "edgeless-network",
  "testnet": false
} as const satisfies Chain;