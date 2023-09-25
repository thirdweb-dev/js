import type { Chain } from "../src/types";
export default {
  "chainId": 28945486,
  "chain": "AUX",
  "name": "Auxilium Network Mainnet",
  "rpc": [
    "https://auxilium-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.auxilium.global"
  ],
  "slug": "auxilium-network",
  "faucets": [],
  "nativeCurrency": {
    "name": "Auxilium coin",
    "symbol": "AUX",
    "decimals": 18
  },
  "infoURL": "https://auxilium.global",
  "shortName": "auxi",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;