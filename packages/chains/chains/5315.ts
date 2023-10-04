import type { Chain } from "../src/types";
export default {
  "chain": "UZMI",
  "chainId": 5315,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://uzmigames.com.br/",
  "name": "Uzmi Network Mainnet",
  "nativeCurrency": {
    "name": "UZMI",
    "symbol": "UZMI",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://uzmi-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://network.uzmigames.com.br/"
  ],
  "shortName": "UZMI",
  "slug": "uzmi-network",
  "testnet": false
} as const satisfies Chain;