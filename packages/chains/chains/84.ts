import type { Chain } from "../src/types";
export default {
  "chain": "LNQ",
  "chainId": 84,
  "explorers": [
    {
      "name": "Linqto Devnet Explorer",
      "url": "https://explorer.linqto-dev.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://linqto.com",
  "name": "Linqto Devnet",
  "nativeCurrency": {
    "name": "XRP",
    "symbol": "XRP",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://linqto-devnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://linqto-dev.com"
  ],
  "shortName": "linqto-devnet",
  "slug": "linqto-devnet",
  "testnet": false
} as const satisfies Chain;