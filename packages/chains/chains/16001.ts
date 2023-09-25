import type { Chain } from "../src/types";
export default {
  "chainId": 16001,
  "chain": "MTTTest",
  "name": "MetaDot Testnet",
  "rpc": [
    "https://metadot-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.metadot.network"
  ],
  "slug": "metadot-testnet",
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
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;