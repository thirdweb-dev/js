import type { Chain } from "../src/types";
export default {
  "chain": "Magnet",
  "chainId": 19527,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://magnet.magport.io/",
  "name": "Magnet Network",
  "nativeCurrency": {
    "name": "Magnet Network",
    "symbol": "DOT",
    "decimals": 18
  },
  "networkId": 19527,
  "rpc": [
    "https://magnet-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://19527.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://magnet-rpc.magport.io/"
  ],
  "shortName": "mgt",
  "slug": "magnet-network",
  "testnet": false
} as const satisfies Chain;