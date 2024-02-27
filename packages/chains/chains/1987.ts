import type { Chain } from "../src/types";
export default {
  "chain": "EGEM",
  "chainId": 1987,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://egem.io",
  "name": "EtherGem",
  "nativeCurrency": {
    "name": "EtherGem Ether",
    "symbol": "EGEM",
    "decimals": 18
  },
  "networkId": 1987,
  "rpc": [
    "https://1987.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://jsonrpc.egem.io/custom"
  ],
  "shortName": "egem",
  "slip44": 1987,
  "slug": "ethergem",
  "testnet": false
} as const satisfies Chain;