import type { Chain } from "../src/types";
export default {
  "chainId": 35,
  "chain": "TBWG",
  "name": "TBWG Chain",
  "rpc": [
    "https://tbwg-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tbwg.io"
  ],
  "slug": "tbwg-chain",
  "faucets": [],
  "nativeCurrency": {
    "name": "TBWG Ether",
    "symbol": "TBG",
    "decimals": 18
  },
  "infoURL": "https://tbwg.io",
  "shortName": "tbwg",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;