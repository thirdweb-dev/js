import type { Chain } from "../src/types";
export default {
  "name": "Acala Network",
  "chain": "ACA",
  "rpc": [
    "https://acala-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-rpc-acala.aca-api.network",
    "wss://eth-rpc-acala.aca-api.network"
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
    "name": "Acala Token",
    "symbol": "ACA",
    "decimals": 18
  },
  "infoURL": "https://acala.network",
  "shortName": "aca",
  "chainId": 787,
  "networkId": 787,
  "slip44": 787,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.acala.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "acala-network"
} as const satisfies Chain;