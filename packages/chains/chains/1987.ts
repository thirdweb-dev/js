import type { Chain } from "../src/types";
export default {
  "chainId": 1987,
  "chain": "EGEM",
  "name": "EtherGem",
  "rpc": [
    "https://ethergem.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://jsonrpc.egem.io/custom"
  ],
  "slug": "ethergem",
  "faucets": [],
  "nativeCurrency": {
    "name": "EtherGem Ether",
    "symbol": "EGEM",
    "decimals": 18
  },
  "infoURL": "https://egem.io",
  "shortName": "egem",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;