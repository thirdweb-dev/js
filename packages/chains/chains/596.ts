import type { Chain } from "../src/types";
export default {
  "chainId": 596,
  "chain": "KAR",
  "name": "Karura Network Testnet",
  "rpc": [
    "https://karura-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-rpc-karura-testnet.aca-staging.network",
    "wss://eth-rpc-karura-testnet.aca-staging.network"
  ],
  "slug": "karura-network-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Karura Token",
    "symbol": "KAR",
    "decimals": 18
  },
  "infoURL": "https://karura.network",
  "shortName": "tkar",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.karura-testnet.aca-staging.network",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;