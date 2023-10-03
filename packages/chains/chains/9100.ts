import type { Chain } from "../src/types";
export default {
  "chain": "Genesis",
  "chainId": 9100,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://genesis-gn.com",
  "name": "Genesis Coin",
  "nativeCurrency": {
    "name": "GN Coin",
    "symbol": "GNC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://genesis-coin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://genesis-gn.com",
    "wss://genesis-gn.com"
  ],
  "shortName": "GENEC",
  "slug": "genesis-coin",
  "testnet": false
} as const satisfies Chain;