import type { Chain } from "../src/types";
export default {
  "chain": "TOKI",
  "chainId": 8655,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://www.buildwithtoki.com",
  "name": "Toki Testnet",
  "nativeCurrency": {
    "name": "Toki",
    "symbol": "TOKI",
    "decimals": 18
  },
  "networkId": 8655,
  "rpc": [
    "https://8655.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.buildwithtoki.com/v0/rpc"
  ],
  "shortName": "toki-testnet",
  "slip44": 1,
  "slug": "toki-testnet",
  "testnet": true
} as const satisfies Chain;