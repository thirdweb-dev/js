import type { Chain } from "../src/types";
export default {
  "name": "PulseChain Mainnet",
  "shortName": "pls",
  "chain": "PLS",
  "chainId": 369,
  "networkId": 369,
  "infoURL": "https://pulsechain.com/",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Pulse",
    "symbol": "PLS",
    "decimals": 18
  },
  "testnet": false,
  "slug": "pulsechain"
} as const satisfies Chain;