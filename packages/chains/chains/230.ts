import type { Chain } from "../src/types";
export default {
  "name": "SwapDEX",
  "chain": "SDX",
  "rpc": [
    "https://swapdex.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.swapdex.network",
    "wss://ss.swapdex.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "SwapDEX",
    "symbol": "SDX",
    "decimals": 18
  },
  "infoURL": "https://swapdex.network/",
  "shortName": "SDX",
  "chainId": 230,
  "networkId": 230,
  "explorers": [
    {
      "name": "SwapDEX",
      "url": "https://evm.swapdex.network",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "swapdex"
} as const satisfies Chain;