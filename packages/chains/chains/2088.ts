import type { Chain } from "../src/types";
export default {
  "name": "Altair",
  "chain": "AIR",
  "rpc": [
    "wss://fullnode.altair.centrifuge.io"
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
    "name": "Altair",
    "symbol": "AIR",
    "decimals": 18
  },
  "infoURL": "https://centrifuge.io",
  "shortName": "air",
  "chainId": 2088,
  "networkId": 2088,
  "testnet": false,
  "slug": "altair"
} as const satisfies Chain;