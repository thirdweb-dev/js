import type { Chain } from "../src/types";
export default {
  "chain": "EGEM",
  "chainId": 1987,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://egem.io",
  "name": "EtherGem",
  "nativeCurrency": {
    "name": "EtherGem Ether",
    "symbol": "EGEM",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://ethergem.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://jsonrpc.egem.io/custom"
  ],
  "shortName": "egem",
  "slug": "ethergem",
  "testnet": false
} as const satisfies Chain;