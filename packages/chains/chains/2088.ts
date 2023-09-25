import type { Chain } from "../src/types";
export default {
  "chainId": 2088,
  "chain": "AIR",
  "name": "Altair",
  "rpc": [
    "https://altair.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "wss://fullnode.altair.centrifuge.io"
  ],
  "slug": "altair",
  "faucets": [],
  "nativeCurrency": {
    "name": "Altair",
    "symbol": "AIR",
    "decimals": 18
  },
  "infoURL": "https://centrifuge.io",
  "shortName": "air",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;