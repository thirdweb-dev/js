import type { Chain } from "../src/types";
export default {
  "chain": "PHT",
  "chainId": 162,
  "explorers": [],
  "faucets": [
    "https://discuss.lightstreams.network/t/request-test-tokens"
  ],
  "features": [],
  "infoURL": "https://explorer.sirius.lightstreams.io",
  "name": "Lightstreams Testnet",
  "nativeCurrency": {
    "name": "Lightstreams PHT",
    "symbol": "PHT",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://lightstreams-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node.sirius.lightstreams.io"
  ],
  "shortName": "tpht",
  "slug": "lightstreams-testnet",
  "testnet": true
} as const satisfies Chain;