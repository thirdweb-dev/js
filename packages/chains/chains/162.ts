import type { Chain } from "../src/types";
export default {
  "chainId": 162,
  "chain": "PHT",
  "name": "Lightstreams Testnet",
  "rpc": [
    "https://lightstreams-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node.sirius.lightstreams.io"
  ],
  "slug": "lightstreams-testnet",
  "faucets": [
    "https://discuss.lightstreams.network/t/request-test-tokens"
  ],
  "nativeCurrency": {
    "name": "Lightstreams PHT",
    "symbol": "PHT",
    "decimals": 18
  },
  "infoURL": "https://explorer.sirius.lightstreams.io",
  "shortName": "tpht",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;