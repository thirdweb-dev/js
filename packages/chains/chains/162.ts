import type { Chain } from "../src/types";
export default {
  "chain": "PHT",
  "chainId": 162,
  "explorers": [],
  "faucets": [
    "https://discuss.lightstreams.network/t/request-test-tokens"
  ],
  "infoURL": "https://explorer.sirius.lightstreams.io",
  "name": "Lightstreams Testnet",
  "nativeCurrency": {
    "name": "Lightstreams PHT",
    "symbol": "PHT",
    "decimals": 18
  },
  "networkId": 162,
  "rpc": [
    "https://lightstreams-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://162.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node.sirius.lightstreams.io"
  ],
  "shortName": "tpht",
  "slip44": 1,
  "slug": "lightstreams-testnet",
  "testnet": true
} as const satisfies Chain;