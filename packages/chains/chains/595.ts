import type { Chain } from "../src/types";
export default {
  "name": "Acala Mandala Testnet TC9",
  "chain": "mACA",
  "rpc": [
    "https://acala-mandala-testnet-tc9.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://eth-rpc-tc9.aca-staging.network",
    "wss://eth-rpc-tc9.aca-staging.network"
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
    "name": "Acala Mandala Token",
    "symbol": "mACA",
    "decimals": 18
  },
  "infoURL": "https://acala.network",
  "shortName": "maca",
  "chainId": 595,
  "networkId": 595,
  "slip44": 595,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://blockscout.mandala.aca-staging.network",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "acala-mandala-testnet-tc9"
} as const satisfies Chain;