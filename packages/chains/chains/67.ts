import type { Chain } from "../src/types";
export default {
  "chainId": 67,
  "chain": "DBM",
  "name": "DBChain Testnet",
  "rpc": [
    "https://dbchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://test-rpc.dbmbp.com"
  ],
  "slug": "dbchain-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "DBChain Testnet",
    "symbol": "DBM",
    "decimals": 18
  },
  "infoURL": "http://test.dbmbp.com",
  "shortName": "dbm",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;