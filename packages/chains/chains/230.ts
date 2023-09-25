import type { Chain } from "../src/types";
export default {
  "chainId": 230,
  "chain": "SDX",
  "name": "SwapDEX",
  "rpc": [
    "https://swapdex.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.swapdex.network",
    "wss://ss.swapdex.network"
  ],
  "slug": "swapdex",
  "faucets": [],
  "nativeCurrency": {
    "name": "SwapDEX",
    "symbol": "SDX",
    "decimals": 18
  },
  "infoURL": "https://swapdex.network/",
  "shortName": "SDX",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "SwapDEX",
      "url": "https://evm.swapdex.network",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;