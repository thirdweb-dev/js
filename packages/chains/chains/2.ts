import type { Chain } from "../src/types";
export default {
  "chain": "EXP",
  "chainId": 2,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://expanse.tech",
  "name": "Expanse Network",
  "nativeCurrency": {
    "name": "Expanse Network Ether",
    "symbol": "EXP",
    "decimals": 18
  },
  "networkId": 1,
  "rpc": [
    "https://2.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node.expanse.tech"
  ],
  "shortName": "exp",
  "slip44": 40,
  "slug": "expanse-network",
  "testnet": false
} as const satisfies Chain;