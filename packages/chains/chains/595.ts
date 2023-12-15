import type { Chain } from "../src/types";
export default {
  "chain": "mACA",
  "chainId": 595,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.mandala.aca-staging.network",
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
  "name": "Acala Mandala Testnet TC9",
  "nativeCurrency": {
    "name": "Acala Mandala Token",
    "symbol": "mACA",
    "decimals": 18
  },
  "networkId": 595,
  "rpc": [
    "https://acala-mandala-testnet-tc9.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://595.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-rpc-tc9.aca-staging.network",
    "wss://eth-rpc-tc9.aca-staging.network"
  ],
  "shortName": "maca",
  "slip44": 595,
  "slug": "acala-mandala-testnet-tc9",
  "testnet": true
} as const satisfies Chain;