import type { Chain } from "../src/types";
export default {
  "chainId": 24484,
  "chain": "WEB",
  "name": "Webchain",
  "rpc": [],
  "slug": "webchain",
  "faucets": [],
  "nativeCurrency": {
    "name": "Webchain Ether",
    "symbol": "WEB",
    "decimals": 18
  },
  "infoURL": "https://webchain.network",
  "shortName": "web",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;