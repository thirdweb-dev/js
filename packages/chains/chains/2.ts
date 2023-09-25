import type { Chain } from "../src/types";
export default {
  "chainId": 2,
  "chain": "EXP",
  "name": "Expanse Network",
  "rpc": [
    "https://expanse-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node.expanse.tech"
  ],
  "slug": "expanse-network",
  "faucets": [],
  "nativeCurrency": {
    "name": "Expanse Network Ether",
    "symbol": "EXP",
    "decimals": 18
  },
  "infoURL": "https://expanse.tech",
  "shortName": "exp",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;