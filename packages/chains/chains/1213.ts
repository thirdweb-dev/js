import type { Chain } from "../src/types";
export default {
  "chainId": 1213,
  "chain": "POPCATEUM",
  "name": "Popcateum Mainnet",
  "rpc": [
    "https://popcateum.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dataseed.popcateum.org"
  ],
  "slug": "popcateum",
  "faucets": [],
  "nativeCurrency": {
    "name": "Popcat",
    "symbol": "POP",
    "decimals": 18
  },
  "infoURL": "https://popcateum.org",
  "shortName": "popcat",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "popcateum explorer",
      "url": "https://explorer.popcateum.org",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;