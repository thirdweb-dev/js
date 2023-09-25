import type { Chain } from "../src/types";
export default {
  "chainId": 5315,
  "chain": "UZMI",
  "name": "Uzmi Network Mainnet",
  "rpc": [
    "https://uzmi-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://network.uzmigames.com.br/"
  ],
  "slug": "uzmi-network",
  "faucets": [],
  "nativeCurrency": {
    "name": "UZMI",
    "symbol": "UZMI",
    "decimals": 18
  },
  "infoURL": "https://uzmigames.com.br/",
  "shortName": "UZMI",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;