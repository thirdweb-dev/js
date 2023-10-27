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
  "infoURL": "https://swapdex.network/",
  "name": "SwapDEX",
  "nativeCurrency": {
    "name": "SwapDEX",
    "symbol": "SDX",
    "decimals": 18
  },
  "networkId": 230,
  "rpc": [
    "https://swapdex.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://230.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.swapdex.network",
    "wss://ss.swapdex.network"
  ],
  "shortName": "SDX",
  "slug": "swapdex",
  "testnet": false
} as const satisfies Chain;