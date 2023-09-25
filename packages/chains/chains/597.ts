import type { Chain } from "../src/types";
export default {
  "chainId": 597,
  "chain": "ACA",
  "name": "Acala Network Testnet",
  "rpc": [
    "https://acala-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-rpc-acala-testnet.aca-staging.network",
    "wss://eth-rpc-acala-testnet.aca-staging.network"
  ],
  "slug": "acala-network-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Acala Token",
    "symbol": "ACA",
    "decimals": 18
  },
  "infoURL": "https://acala.network",
  "shortName": "taca",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.acala-dev.aca-dev.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;