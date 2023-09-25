import type { Chain } from "../src/types";
export default {
  "chainId": 84,
  "chain": "LNQ",
  "name": "Linqto Devnet",
  "rpc": [
    "https://linqto-devnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://linqto-dev.com"
  ],
  "slug": "linqto-devnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "XRP",
    "symbol": "XRP",
    "decimals": 6
  },
  "infoURL": "https://linqto.com",
  "shortName": "linqto-devnet",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Linqto Devnet Explorer",
      "url": "https://explorer.linqto-dev.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;