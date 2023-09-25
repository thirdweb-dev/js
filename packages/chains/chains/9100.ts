import type { Chain } from "../src/types";
export default {
  "chainId": 9100,
  "chain": "Genesis",
  "name": "Genesis Coin",
  "rpc": [
    "https://genesis-coin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://genesis-gn.com",
    "wss://genesis-gn.com"
  ],
  "slug": "genesis-coin",
  "faucets": [],
  "nativeCurrency": {
    "name": "GN Coin",
    "symbol": "GNC",
    "decimals": 18
  },
  "infoURL": "https://genesis-gn.com",
  "shortName": "GENEC",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;