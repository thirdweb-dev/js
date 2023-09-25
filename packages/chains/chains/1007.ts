import type { Chain } from "../src/types";
export default {
  "chainId": 1007,
  "chain": "NEW",
  "name": "Newton Testnet",
  "rpc": [
    "https://newton-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.newchain.newtonproject.org"
  ],
  "slug": "newton-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Newton",
    "symbol": "NEW",
    "decimals": 18
  },
  "infoURL": "https://www.newtonproject.org/",
  "shortName": "tnew",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;