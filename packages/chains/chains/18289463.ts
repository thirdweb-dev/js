import type { Chain } from "../src/types";
export default {
  "chain": "ILT",
  "chainId": 18289463,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://iolite.io",
  "name": "IOLite",
  "nativeCurrency": {
    "name": "IOLite Ether",
    "symbol": "ILT",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://iolite.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://net.iolite.io"
  ],
  "shortName": "ilt",
  "slug": "iolite",
  "testnet": false
} as const satisfies Chain;