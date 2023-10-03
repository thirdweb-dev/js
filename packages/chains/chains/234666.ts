import type { Chain } from "../src/types";
export default {
  "chain": "tHYM",
  "chainId": 234666,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://haymoswap.web.app/",
  "name": "Haymo Testnet",
  "nativeCurrency": {
    "name": "HAYMO",
    "symbol": "HYM",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://haymo-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet1.haymo.network"
  ],
  "shortName": "hym",
  "slug": "haymo-testnet",
  "testnet": true
} as const satisfies Chain;