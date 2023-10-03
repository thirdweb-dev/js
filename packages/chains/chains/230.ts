import type { Chain } from "../src/types";
export default {
  "chain": "SDX",
  "chainId": 230,
  "explorers": [
    {
      "name": "SwapDEX",
      "url": "https://evm.swapdex.network",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://swapdex.network/",
  "name": "SwapDEX",
  "nativeCurrency": {
    "name": "SwapDEX",
    "symbol": "SDX",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://swapdex.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.swapdex.network",
    "wss://ss.swapdex.network"
  ],
  "shortName": "SDX",
  "slug": "swapdex",
  "testnet": false
} as const satisfies Chain;