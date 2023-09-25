import type { Chain } from "../src/types";
export default {
  "chainId": 3501,
  "chain": "JFIN",
  "name": "JFIN Chain",
  "rpc": [
    "https://jfin-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.jfinchain.com"
  ],
  "slug": "jfin-chain",
  "faucets": [],
  "nativeCurrency": {
    "name": "JFIN Coin",
    "symbol": "jfin",
    "decimals": 18
  },
  "infoURL": "https://jfinchain.com",
  "shortName": "jfin",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "JFIN Chain Explorer",
      "url": "https://exp.jfinchain.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;