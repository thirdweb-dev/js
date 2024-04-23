import type { Chain } from "../src/types";
export default {
  "chain": "ZTC",
  "chainId": 9998,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://ztc.best",
  "name": "Ztc Mainnet",
  "nativeCurrency": {
    "name": "Ztcer",
    "symbol": "ZTC",
    "decimals": 5
  },
  "networkId": 9998,
  "rpc": [
    "https://9998.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://zitcoin.us"
  ],
  "shortName": "ZTC",
  "slug": "ztc",
  "testnet": false
} as const satisfies Chain;