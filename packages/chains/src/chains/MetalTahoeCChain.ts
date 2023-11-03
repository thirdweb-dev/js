import type { Chain } from "../types";
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
  "infoURL": "https://www.metalblockchain.org/",
  "name": "Metal Tahoe C-Chain",
  "nativeCurrency": {
    "name": "Metal",
    "symbol": "METAL",
    "decimals": 18
  },
  "networkId": 381932,
  "rpc": [
    "https://metal-tahoe-c-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://381932.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://tahoe.metalblockchain.org/ext/bc/C/rpc"
  ],
  "shortName": "Tahoe",
  "slip44": 9005,
  "slug": "metal-tahoe-c-chain",
  "testnet": false
} as const satisfies Chain;