import type { Chain } from "../src/types";
export default {
  "chain": "ACA",
  "chainId": 787,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.acala.network",
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
  "infoURL": "https://acala.network",
  "name": "Acala Network",
  "nativeCurrency": {
    "name": "Acala Token",
    "symbol": "ACA",
    "decimals": 18
  },
  "networkId": 787,
  "rpc": [
    "https://acala-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://787.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-rpc-acala.aca-api.network",
    "wss://eth-rpc-acala.aca-api.network"
  ],
  "shortName": "aca",
  "slip44": 787,
  "slug": "acala-network",
  "testnet": false
} as const satisfies Chain;