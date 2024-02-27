import type { Chain } from "../src/types";
export default {
  "chain": "NEW",
  "chainId": 1012,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://www.newtonproject.org/",
  "name": "Newton",
  "nativeCurrency": {
    "name": "Newton",
    "symbol": "NEW",
    "decimals": 18
  },
  "networkId": 1012,
  "rpc": [
    "https://1012.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://global.rpc.mainnet.newtonproject.org"
  ],
  "shortName": "new",
  "slug": "newton",
  "testnet": false
} as const satisfies Chain;