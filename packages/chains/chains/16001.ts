import type { Chain } from "../src/types";
export default {
  "chain": "MTTTest",
  "chainId": 16001,
  "explorers": [],
  "faucets": [
    "https://faucet.metadot.network/"
  ],
  "features": [],
  "infoURL": "https://metadot.network",
  "name": "MetaDot Testnet",
  "nativeCurrency": {
    "name": "MetaDot Token TestNet",
    "symbol": "MTTest",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://metadot-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.metadot.network"
  ],
  "shortName": "mtttest",
  "slug": "metadot-testnet",
  "testnet": true
} as const satisfies Chain;