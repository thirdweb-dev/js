import type { Chain } from "../src/types";
export default {
  "chain": "HZC",
  "chainId": 80096,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://hizoco.net:38443",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "http://hizoco.net",
  "name": "Hizoco mainnet",
  "nativeCurrency": {
    "name": "Hizoco",
    "symbol": "HZC",
    "decimals": 18
  },
  "networkId": 80096,
  "rpc": [
    "https://80096.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://hizoco.net/rpc"
  ],
  "shortName": "hzc",
  "slug": "hizoco",
  "testnet": false
} as const satisfies Chain;