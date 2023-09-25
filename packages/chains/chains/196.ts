import type { Chain } from "../src/types";
export default {
  "chainId": 196,
  "chain": "okbchain",
  "name": "OKBChain Mainnet",
  "rpc": [],
  "slug": "okbchain",
  "faucets": [],
  "nativeCurrency": {
    "name": "OKBChain Global Utility Token",
    "symbol": "OKB",
    "decimals": 18
  },
  "infoURL": "https://www.okex.com/okc",
  "shortName": "okb",
  "testnet": false,
  "status": "incubating",
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;