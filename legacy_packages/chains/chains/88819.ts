import type { Chain } from "../src/types";
export default {
  "chain": "Unit Zero",
  "chainId": 88819,
  "explorers": [
    {
      "name": "explorer-stagenet",
      "url": "https://explorer-stagenet.unit0.dev",
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
  "name": "Unit Zero Stagenet",
  "nativeCurrency": {
    "name": "UNIT0",
    "symbol": "UNIT0",
    "decimals": 18
  },
  "networkId": 88819,
  "rpc": [
    "https://88819.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-stagenet.unit0.dev"
  ],
  "shortName": "unit0-stagenet",
  "slug": "unit-zero-stagenet",
  "testnet": false
} as const satisfies Chain;