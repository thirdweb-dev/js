import type { Chain } from "../src/types";
export default {
  "chain": "KAR",
  "chainId": 686,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.karura.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://acala.network/karura",
  "name": "Karura Network",
  "nativeCurrency": {
    "name": "Karura Token",
    "symbol": "KAR",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://karura-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-rpc-karura.aca-api.network",
    "wss://eth-rpc-karura.aca-api.network"
  ],
  "shortName": "kar",
  "slug": "karura-network",
  "testnet": false
} as const satisfies Chain;