import type { Chain } from "../src/types";
export default {
  "chain": "PHT",
  "chainId": 163,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://explorer.lightstreams.io",
  "name": "Lightstreams Mainnet",
  "nativeCurrency": {
    "name": "Lightstreams PHT",
    "symbol": "PHT",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://lightstreams.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node.mainnet.lightstreams.io"
  ],
  "shortName": "pht",
  "slug": "lightstreams",
  "testnet": false
} as const satisfies Chain;