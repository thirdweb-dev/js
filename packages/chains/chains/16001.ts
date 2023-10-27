import type { Chain } from "../src/types";
export default {
  "chain": "MTTTest",
  "chainId": 16001,
  "explorers": [],
  "faucets": [
    "https://faucet.metadot.network/"
  ],
  "infoURL": "https://metadot.network",
  "name": "MetaDot Testnet",
  "nativeCurrency": {
    "name": "MetaDot Token TestNet",
    "symbol": "MTTest",
    "decimals": 18
  },
  "networkId": 16001,
  "rpc": [
    "https://metadot-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://16001.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.metadot.network"
  ],
  "shortName": "mtttest",
  "slug": "metadot-testnet",
  "testnet": true
} as const satisfies Chain;