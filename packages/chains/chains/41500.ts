import type { Chain } from "../src/types";
export default {
  "chainId": 41500,
  "chain": "Opulent-X",
  "name": "Opulent-X BETA",
  "rpc": [
    "https://opulent-x-beta.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://connect.opulent-x.com"
  ],
  "slug": "opulent-x-beta",
  "faucets": [],
  "nativeCurrency": {
    "name": "Oxyn Gas",
    "symbol": "OXYN",
    "decimals": 18
  },
  "infoURL": "https://beta.opulent-x.com",
  "shortName": "ox-beta",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Opulent-X BETA Explorer",
      "url": "https://explorer.opulent-x.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;