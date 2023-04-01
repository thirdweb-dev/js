import type { Chain } from "../src/types";
export default {
  "name": "MetaDot Testnet",
  "chain": "MTTTest",
  "rpc": [],
  "faucets": [
    "https://faucet.metadot.network/"
  ],
  "nativeCurrency": {
    "name": "MetaDot Token TestNet",
    "symbol": "MTTest",
    "decimals": 18
  },
  "infoURL": "https://metadot.network",
  "shortName": "mtttest",
  "chainId": 16001,
  "networkId": 16001,
  "testnet": true,
  "slug": "metadot-testnet"
} as const satisfies Chain;