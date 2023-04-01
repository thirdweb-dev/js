import type { Chain } from "../src/types";
export default {
  "name": "IOLite",
  "chain": "ILT",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "IOLite Ether",
    "symbol": "ILT",
    "decimals": 18
  },
  "infoURL": "https://iolite.io",
  "shortName": "ilt",
  "chainId": 18289463,
  "networkId": 18289463,
  "testnet": false,
  "slug": "iolite"
} as const satisfies Chain;