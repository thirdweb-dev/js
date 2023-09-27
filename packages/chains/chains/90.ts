import type { Chain } from "../src/types";
export default {
  "name": "Garizon Stage0",
  "chain": "GAR",
  "icon": "garizon",
  "rpc": [
    "https://garizon-stage0.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://s0.garizon.net/rpc"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Garizon",
    "symbol": "GAR",
    "decimals": 18
  },
  "infoURL": "https://garizon.com",
  "shortName": "gar-s0",
  "chainId": 90,
  "networkId": 90,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.garizon.com",
      "icon": "garizon",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "garizon-stage0"
} as const satisfies Chain;