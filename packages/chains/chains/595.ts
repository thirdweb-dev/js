import type { Chain } from "../src/types";
export default {
  "chainId": 595,
  "chain": "mACA",
  "name": "Acala Mandala Testnet TC9",
  "rpc": [
    "https://acala-mandala-testnet-tc9.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-rpc-tc9.aca-staging.network",
    "wss://eth-rpc-tc9.aca-staging.network"
  ],
  "slug": "acala-mandala-testnet-tc9",
  "faucets": [],
  "nativeCurrency": {
    "name": "Acala Mandala Token",
    "symbol": "mACA",
    "decimals": 18
  },
  "infoURL": "https://acala.network",
  "shortName": "maca",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.mandala.aca-staging.network",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;