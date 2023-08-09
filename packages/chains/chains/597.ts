import type { Chain } from "../src/types";
export default {
  "name": "Acala Network Testnet",
  "chain": "ACA",
  "rpc": [
    "https://acala-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-rpc-acala-testnet.aca-staging.network",
    "wss://eth-rpc-acala-testnet.aca-staging.network"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Acala Token",
    "symbol": "ACA",
    "decimals": 18
  },
  "infoURL": "https://acala.network",
  "shortName": "taca",
  "chainId": 597,
  "networkId": 597,
  "slip44": 597,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.acala-dev.aca-dev.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "acala-network-testnet"
} as const satisfies Chain;