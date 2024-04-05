import type { Chain } from "../src/types";
export default {
  "chain": "Unit Zero",
  "chainId": 88817,
  "explorers": [
    {
      "name": "explorer-testnet",
      "url": "https://explorer-testnet.unit0.dev",
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
  "infoURL": "https://units.network",
  "name": "Unit Zero Testnet",
  "nativeCurrency": {
    "name": "UNIT0",
    "symbol": "UNIT0",
    "decimals": 18
  },
  "networkId": 88817,
  "rpc": [
    "https://88817.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.unit0.dev"
  ],
  "shortName": "unit0-testnet",
  "slug": "unit-zero-testnet",
  "testnet": true
} as const satisfies Chain;