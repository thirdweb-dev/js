import type { Chain } from "../src/types";
export default {
  "chain": "AUX",
  "chainId": 28945486,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://auxilium.global",
  "name": "Auxilium Network Mainnet",
  "nativeCurrency": {
    "name": "Auxilium coin",
    "symbol": "AUX",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://auxilium-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.auxilium.global"
  ],
  "shortName": "auxi",
  "slug": "auxilium-network",
  "testnet": false
} as const satisfies Chain;