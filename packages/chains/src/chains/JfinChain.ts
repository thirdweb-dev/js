import type { Chain } from "../types";
export default {
  "chain": "JFIN",
  "chainId": 3501,
  "explorers": [
    {
      "name": "JFIN Chain Explorer",
      "url": "https://exp.jfinchain.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://jfinchain.com",
  "name": "JFIN Chain",
  "nativeCurrency": {
    "name": "JFIN Coin",
    "symbol": "jfin",
    "decimals": 18
  },
  "networkId": 3501,
  "rpc": [
    "https://jfin-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://3501.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.jfinchain.com"
  ],
  "shortName": "jfin",
  "slug": "jfin-chain",
  "testnet": false
} as const satisfies Chain;