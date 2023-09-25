import type { Chain } from "../src/types";
export default {
  "chainId": 787,
  "chain": "ACA",
  "name": "Acala Network",
  "rpc": [
    "https://acala-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-rpc-acala.aca-api.network",
    "wss://eth-rpc-acala.aca-api.network"
  ],
  "slug": "acala-network",
  "faucets": [],
  "nativeCurrency": {
    "name": "Acala Token",
    "symbol": "ACA",
    "decimals": 18
  },
  "infoURL": "https://acala.network",
  "shortName": "aca",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.acala.network",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;