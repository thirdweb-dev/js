import type { Chain } from "../src/types";
export default {
  "name": "DBChain Testnet",
  "chain": "DBM",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "DBChain Testnet",
    "symbol": "DBM",
    "decimals": 18
  },
  "infoURL": "http://test.dbmbp.com",
  "shortName": "dbm",
  "chainId": 67,
  "networkId": 67,
  "testnet": true,
  "slug": "dbchain-testnet"
} as const satisfies Chain;