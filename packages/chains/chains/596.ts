import type { Chain } from "../src/types";
export default {
  "chain": "KAR",
  "chainId": 596,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.karura-testnet.aca-staging.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://karura.network",
  "name": "Karura Network Testnet",
  "nativeCurrency": {
    "name": "Karura Token",
    "symbol": "KAR",
    "decimals": 18
  },
  "networkId": 596,
  "rpc": [
    "https://karura-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://596.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-rpc-karura-testnet.aca-staging.network",
    "wss://eth-rpc-karura-testnet.aca-staging.network"
  ],
  "shortName": "tkar",
  "slip44": 1,
  "slug": "karura-network-testnet",
  "testnet": true
} as const satisfies Chain;