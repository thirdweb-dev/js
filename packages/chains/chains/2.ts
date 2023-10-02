import type { Chain } from "../src/types";
export default {
  "chain": "EXP",
  "chainId": 2,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://expanse.tech",
  "name": "Expanse Network",
  "nativeCurrency": {
    "name": "Expanse Network Ether",
    "symbol": "EXP",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://expanse-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node.expanse.tech"
  ],
  "shortName": "exp",
  "slug": "expanse-network",
  "testnet": false
} as const satisfies Chain;