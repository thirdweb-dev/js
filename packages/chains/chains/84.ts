import type { Chain } from "../src/types";
export default {
  "name": "Linqto Devnet",
  "chain": "LNQ",
  "rpc": [
    "https://linqto-devnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://linqto-dev.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "XRP",
    "symbol": "XRP",
    "decimals": 18
  },
  "infoURL": "https://linqto.com",
  "shortName": "linqto-devnet",
  "chainId": 84,
  "networkId": 84,
  "explorers": [
    {
      "name": "Linqto Devnet Explorer",
      "url": "https://explorer.linqto-dev.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "linqto-devnet"
} as const satisfies Chain;