import type { Chain } from "../src/types";
export default {
  "chain": "Opulent-X",
  "chainId": 41500,
  "explorers": [
    {
      "name": "Opulent-X BETA Explorer",
      "url": "https://explorer.opulent-x.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://beta.opulent-x.com",
  "name": "Opulent-X BETA",
  "nativeCurrency": {
    "name": "Oxyn Gas",
    "symbol": "OXYN",
    "decimals": 18
  },
  "networkId": 41500,
  "rpc": [
    "https://opulent-x-beta.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://41500.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://connect.opulent-x.com"
  ],
  "shortName": "ox-beta",
  "slug": "opulent-x-beta",
  "testnet": false
} as const satisfies Chain;