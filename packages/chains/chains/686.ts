import type { Chain } from "../src/types";
export default {
  "name": "Karura Network",
  "chain": "KAR",
  "rpc": [
    "https://karura-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-rpc-karura.aca-api.network",
    "wss://eth-rpc-karura.aca-api.network"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Karura Token",
    "symbol": "KAR",
    "decimals": 18
  },
  "infoURL": "https://acala.network/karura",
  "shortName": "kar",
  "chainId": 686,
  "networkId": 686,
  "slip44": 686,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.karura.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "karura-network"
} as const satisfies Chain;