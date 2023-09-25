import type { Chain } from "../src/types";
export default {
  "chainId": 163,
  "chain": "PHT",
  "name": "Lightstreams Mainnet",
  "rpc": [
    "https://lightstreams.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node.mainnet.lightstreams.io"
  ],
  "slug": "lightstreams",
  "faucets": [],
  "nativeCurrency": {
    "name": "Lightstreams PHT",
    "symbol": "PHT",
    "decimals": 18
  },
  "infoURL": "https://explorer.lightstreams.io",
  "shortName": "pht",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;