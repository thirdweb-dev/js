import type { Chain } from "../src/types";
export default {
  "chain": "TBWG",
  "chainId": 35,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://tbwg.io",
  "name": "TBWG Chain",
  "nativeCurrency": {
    "name": "TBWG Ether",
    "symbol": "TBG",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://tbwg-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tbwg.io"
  ],
  "shortName": "tbwg",
  "slug": "tbwg-chain",
  "testnet": false
} as const satisfies Chain;