import type { Chain } from "../src/types";
export default {
  "chainId": 381932,
  "chain": "Metal",
  "name": "Metal Tahoe C-Chain",
  "rpc": [
    "https://metal-tahoe-c-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://tahoe.metalblockchain.org/ext/bc/C/rpc"
  ],
  "slug": "metal-tahoe-c-chain",
  "faucets": [],
  "nativeCurrency": {
    "name": "Metal",
    "symbol": "METAL",
    "decimals": 18
  },
  "infoURL": "https://www.metalblockchain.org/",
  "shortName": "Tahoe",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "metalscan",
      "url": "https://tahoe.metalscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;