import type { Chain } from "../src/types";
export default {
  "chainId": 42069,
  "chain": "42069",
  "name": "pegglecoin",
  "rpc": [],
  "slug": "pegglecoin",
  "faucets": [],
  "nativeCurrency": {
    "name": "pegglecoin",
    "symbol": "peggle",
    "decimals": 18
  },
  "infoURL": "https://teampeggle.com",
  "shortName": "PC",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;