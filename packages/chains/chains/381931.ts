import type { Chain } from "../src/types";
export default {
  "chainId": 381931,
  "chain": "Metal",
  "name": "Metal C-Chain",
  "rpc": [
    "https://metal-c-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.metalblockchain.org/ext/bc/C/rpc"
  ],
  "slug": "metal-c-chain",
  "faucets": [],
  "nativeCurrency": {
    "name": "Metal",
    "symbol": "METAL",
    "decimals": 18
  },
  "infoURL": "https://www.metalblockchain.org/",
  "shortName": "metal",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "metalscan",
      "url": "https://metalscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;