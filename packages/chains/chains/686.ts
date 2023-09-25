import type { Chain } from "../src/types";
export default {
  "chainId": 686,
  "chain": "KAR",
  "name": "Karura Network",
  "rpc": [
    "https://karura-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-rpc-karura.aca-api.network",
    "wss://eth-rpc-karura.aca-api.network"
  ],
  "slug": "karura-network",
  "faucets": [],
  "nativeCurrency": {
    "name": "Karura Token",
    "symbol": "KAR",
    "decimals": 18
  },
  "infoURL": "https://acala.network/karura",
  "shortName": "kar",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.karura.network",
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