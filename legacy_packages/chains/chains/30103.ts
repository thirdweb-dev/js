import type { Chain } from "../src/types";
export default {
  "chain": "CAU",
  "chainId": 30103,
  "explorers": [
    {
      "name": "canxium explorer",
      "url": "https://cerium-explorer.canxium.net",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://canxium.org",
  "name": "Cerium Testnet",
  "nativeCurrency": {
    "name": "Canxium",
    "symbol": "CAU",
    "decimals": 18
  },
  "networkId": 30103,
  "rpc": [
    "https://30103.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://cerium-rpc.canxium.net"
  ],
  "shortName": "ceri",
  "slip44": 1,
  "slug": "cerium-testnet",
  "testnet": true
} as const satisfies Chain;