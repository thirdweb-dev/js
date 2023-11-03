import type { Chain } from "../types";
export default {
  "chain": "Genesis",
  "chainId": 9100,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://genesis-gn.com",
  "name": "Genesis Coin",
  "nativeCurrency": {
    "name": "GN Coin",
    "symbol": "GNC",
    "decimals": 18
  },
  "networkId": 9100,
  "rpc": [
    "https://genesis-coin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://9100.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://genesis-gn.com",
    "wss://genesis-gn.com"
  ],
  "shortName": "GENEC",
  "slug": "genesis-coin",
  "testnet": false
} as const satisfies Chain;