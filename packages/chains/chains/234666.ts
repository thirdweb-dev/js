import type { Chain } from "../src/types";
export default {
  "chainId": 234666,
  "chain": "tHYM",
  "name": "Haymo Testnet",
  "rpc": [
    "https://haymo-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet1.haymo.network"
  ],
  "slug": "haymo-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "HAYMO",
    "symbol": "HYM",
    "decimals": 18
  },
  "infoURL": "https://haymoswap.web.app/",
  "shortName": "hym",
  "testnet": true,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;