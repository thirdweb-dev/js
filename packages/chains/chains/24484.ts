import type { Chain } from "../src/types";
export default {
  "name": "Webchain",
  "chain": "WEB",
  "rpc": [],
  "faucets": [],
  "nativeCurrency": {
    "name": "Webchain Ether",
    "symbol": "WEB",
    "decimals": 18
  },
  "infoURL": "https://webchain.network",
  "shortName": "web",
  "chainId": 24484,
  "networkId": 37129,
  "slip44": 227,
  "testnet": false,
  "slug": "webchain"
} as const satisfies Chain;