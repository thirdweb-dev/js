import type { Chain } from "../src/types";
export default {
  "chain": "ASK",
  "chainId": 222,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://permission.io/",
  "name": "Permission",
  "nativeCurrency": {
    "name": "ASK",
    "symbol": "ASK",
    "decimals": 18
  },
  "networkId": 2221,
  "rpc": [
    "https://permission.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://222.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://blockchain-api-mainnet.permission.io/rpc"
  ],
  "shortName": "ASK",
  "slip44": 2221,
  "slug": "permission",
  "status": "deprecated",
  "testnet": false
} as const satisfies Chain;