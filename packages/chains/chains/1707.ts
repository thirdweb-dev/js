import type { Chain } from "../src/types";
export default {
  "chain": "TBSI",
  "chainId": 1707,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://exp.blockchain.or.th",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://blockchain.or.th",
  "name": "TBSI Mainnet",
  "nativeCurrency": {
    "name": "Jinda",
    "symbol": "JINDA",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://tbsi.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.blockchain.or.th"
  ],
  "shortName": "TBSI",
  "slug": "tbsi",
  "testnet": false
} as const satisfies Chain;