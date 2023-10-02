import type { Chain } from "../src/types";
export default {
  "chain": "Metal",
  "chainId": 381932,
  "explorers": [
    {
      "name": "metalscan",
      "url": "https://tahoe.metalscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.metalblockchain.org/",
  "name": "Metal Tahoe C-Chain",
  "nativeCurrency": {
    "name": "Metal",
    "symbol": "METAL",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://metal-tahoe-c-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://tahoe.metalblockchain.org/ext/bc/C/rpc"
  ],
  "shortName": "Tahoe",
  "slug": "metal-tahoe-c-chain",
  "testnet": false
} as const satisfies Chain;