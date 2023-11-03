import type { Chain } from "../types";
export default {
  "chain": "AUX",
  "chainId": 28945486,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://auxilium.global",
  "name": "Auxilium Network Mainnet",
  "nativeCurrency": {
    "name": "Auxilium coin",
    "symbol": "AUX",
    "decimals": 18
  },
  "networkId": 28945486,
  "rpc": [
    "https://auxilium-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://28945486.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.auxilium.global"
  ],
  "shortName": "auxi",
  "slip44": 344,
  "slug": "auxilium-network",
  "testnet": false
} as const satisfies Chain;