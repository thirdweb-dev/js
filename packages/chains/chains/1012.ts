import type { Chain } from "../src/types";
export default {
  "chainId": 1012,
  "chain": "NEW",
  "name": "Newton",
  "rpc": [
    "https://newton.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://global.rpc.mainnet.newtonproject.org"
  ],
  "slug": "newton",
  "faucets": [],
  "nativeCurrency": {
    "name": "Newton",
    "symbol": "NEW",
    "decimals": 18
  },
  "infoURL": "https://www.newtonproject.org/",
  "shortName": "new",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;