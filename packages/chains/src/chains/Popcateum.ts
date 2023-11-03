import type { Chain } from "../types";
export default {
  "chain": "POPCATEUM",
  "chainId": 1213,
  "explorers": [
    {
      "name": "popcateum explorer",
      "url": "https://explorer.popcateum.org",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://popcateum.org",
  "name": "Popcateum Mainnet",
  "nativeCurrency": {
    "name": "Popcat",
    "symbol": "POP",
    "decimals": 18
  },
  "networkId": 1213,
  "rpc": [
    "https://popcateum.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1213.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dataseed.popcateum.org"
  ],
  "shortName": "popcat",
  "slug": "popcateum",
  "testnet": false
} as const satisfies Chain;