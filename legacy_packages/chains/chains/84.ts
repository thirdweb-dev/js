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
  "infoURL": "https://linqto.com",
  "name": "Linqto Devnet",
  "nativeCurrency": {
    "name": "XRP",
    "symbol": "XRP",
    "decimals": 18
  },
  "networkId": 84,
  "rpc": [
    "https://84.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://linqto-dev.com"
  ],
  "shortName": "linqto-devnet",
  "slug": "linqto-devnet",
  "testnet": false
} as const satisfies Chain;