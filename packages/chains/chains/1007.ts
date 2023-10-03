import type { Chain } from "../src/types";
export default {
  "chain": "NEW",
  "chainId": 1007,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.newtonproject.org/",
  "name": "Newton Testnet",
  "nativeCurrency": {
    "name": "Newton",
    "symbol": "NEW",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://newton-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.newchain.newtonproject.org"
  ],
  "shortName": "tnew",
  "slug": "newton-testnet",
  "testnet": true
} as const satisfies Chain;