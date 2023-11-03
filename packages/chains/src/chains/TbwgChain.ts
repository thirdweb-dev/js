import type { Chain } from "../types";
export default {
  "chain": "TBWG",
  "chainId": 35,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://tbwg.io",
  "name": "TBWG Chain",
  "nativeCurrency": {
    "name": "TBWG Ether",
    "symbol": "TBG",
    "decimals": 18
  },
  "networkId": 35,
  "rpc": [
    "https://tbwg-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://35.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.tbwg.io"
  ],
  "shortName": "tbwg",
  "slug": "tbwg-chain",
  "testnet": false
} as const satisfies Chain;