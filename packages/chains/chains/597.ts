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
  "infoURL": "https://acala.network",
  "name": "Acala Network Testnet",
  "nativeCurrency": {
    "name": "Acala Token",
    "symbol": "ACA",
    "decimals": 18
  },
  "networkId": 597,
  "rpc": [
    "https://acala-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://597.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-rpc-acala-testnet.aca-staging.network",
    "wss://eth-rpc-acala-testnet.aca-staging.network"
  ],
  "shortName": "taca",
  "slip44": 597,
  "slug": "acala-network-testnet",
  "testnet": true
} as const satisfies Chain;