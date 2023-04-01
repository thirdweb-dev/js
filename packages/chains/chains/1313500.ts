import type { Chain } from "../src/types";
export default {
  "name": "Xerom",
  "chain": "XERO",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Xerom Ether",
    "symbol": "XERO",
    "decimals": 18
  },
  "infoURL": "https://xerom.org",
  "shortName": "xero",
  "chainId": 1313500,
  "networkId": 1313500,
  "testnet": false,
  "slug": "xerom"
} as const satisfies Chain;