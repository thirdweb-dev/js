import type { Chain } from "../src/types";
export default {
  "chain": "ACA",
  "chainId": 597,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.acala-dev.aca-dev.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://acala.network",
  "name": "Acala Network Testnet",
  "nativeCurrency": {
    "name": "Acala Token",
    "symbol": "ACA",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://acala-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-rpc-acala-testnet.aca-staging.network",
    "wss://eth-rpc-acala-testnet.aca-staging.network"
  ],
  "shortName": "taca",
  "slug": "acala-network-testnet",
  "testnet": true
} as const satisfies Chain;