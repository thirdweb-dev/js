import type { Chain } from "../types";
export default {
  "chain": "PHT",
  "chainId": 163,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://explorer.lightstreams.io",
  "name": "Lightstreams Mainnet",
  "nativeCurrency": {
    "name": "Lightstreams PHT",
    "symbol": "PHT",
    "decimals": 18
  },
  "networkId": 163,
  "rpc": [
    "https://lightstreams.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://163.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node.mainnet.lightstreams.io"
  ],
  "shortName": "pht",
  "slug": "lightstreams",
  "testnet": false
} as const satisfies Chain;