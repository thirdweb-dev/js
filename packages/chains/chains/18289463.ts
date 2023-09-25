import type { Chain } from "../src/types";
export default {
  "chainId": 18289463,
  "chain": "ILT",
  "name": "IOLite",
  "rpc": [
    "https://iolite.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://net.iolite.io"
  ],
  "slug": "iolite",
  "faucets": [],
  "nativeCurrency": {
    "name": "IOLite Ether",
    "symbol": "ILT",
    "decimals": 18
  },
  "infoURL": "https://iolite.io",
  "shortName": "ilt",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;