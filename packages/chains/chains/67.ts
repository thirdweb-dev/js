import type { Chain } from "../src/types";
export default {
  "chain": "DBM",
  "chainId": 67,
  "explorers": [],
  "faucets": [],
  "infoURL": "http://test.dbmbp.com",
  "name": "DBChain Testnet",
  "nativeCurrency": {
    "name": "DBChain Testnet",
    "symbol": "DBM",
    "decimals": 18
  },
  "networkId": 67,
  "rpc": [
    "https://67.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://test-rpc.dbmbp.com"
  ],
  "shortName": "dbm",
  "slip44": 1,
  "slug": "dbchain-testnet",
  "testnet": true
} as const satisfies Chain;