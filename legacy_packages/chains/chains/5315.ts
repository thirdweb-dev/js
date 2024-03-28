import type { Chain } from "../src/types";
export default {
  "chain": "UZMI",
  "chainId": 5315,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://uzmigames.com.br/",
  "name": "Uzmi Network Mainnet",
  "nativeCurrency": {
    "name": "UZMI",
    "symbol": "UZMI",
    "decimals": 18
  },
  "networkId": 5315,
  "rpc": [
    "https://5315.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://network.uzmigames.com.br/"
  ],
  "shortName": "UZMI",
  "slug": "uzmi-network",
  "testnet": false
} as const satisfies Chain;