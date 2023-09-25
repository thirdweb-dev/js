import type { Chain } from "../src/types";
export default {
  "chainId": 1707,
  "chain": "TBSI",
  "name": "TBSI Mainnet",
  "rpc": [
    "https://tbsi.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.blockchain.or.th"
  ],
  "slug": "tbsi",
  "faucets": [],
  "nativeCurrency": {
    "name": "Jinda",
    "symbol": "JINDA",
    "decimals": 18
  },
  "infoURL": "https://blockchain.or.th",
  "shortName": "TBSI",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://exp.blockchain.or.th",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;