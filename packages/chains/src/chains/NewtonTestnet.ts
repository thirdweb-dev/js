import type { Chain } from "../types";
export default {
  "chain": "NEW",
  "chainId": 1007,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://www.newtonproject.org/",
  "name": "Newton Testnet",
  "nativeCurrency": {
    "name": "Newton",
    "symbol": "NEW",
    "decimals": 18
  },
  "networkId": 1007,
  "rpc": [
    "https://newton-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1007.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.newchain.newtonproject.org"
  ],
  "shortName": "tnew",
  "slug": "newton-testnet",
  "testnet": true
} as const satisfies Chain;