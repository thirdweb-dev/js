import type { Chain } from "../src/types";
export default {
  "chain": "ETMP",
  "chainId": 49,
  "explorers": [
    {
      "name": "etmp",
      "url": "https://pioneer.etmscan.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://etm.network",
  "name": "Ennothem Testnet Pioneer",
  "nativeCurrency": {
    "name": "Ennothem",
    "symbol": "ETMP",
    "decimals": 18
  },
  "networkId": 49,
  "rpc": [
    "https://49.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.pioneer.etm.network"
  ],
  "shortName": "etmpTest",
  "slip44": 1,
  "slug": "ennothem-testnet-pioneer",
  "testnet": true
} as const satisfies Chain;