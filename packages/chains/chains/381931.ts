import type { Chain } from "../src/types";
export default {
  "chain": "Metal",
  "chainId": 381931,
  "explorers": [
    {
      "name": "metalscan",
      "url": "https://metalscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.metalblockchain.org/",
  "name": "Metal C-Chain",
  "nativeCurrency": {
    "name": "Metal",
    "symbol": "METAL",
    "decimals": 18
  },
  "networkId": 381931,
  "rpc": [
    "https://metal-c-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://381931.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.metalblockchain.org/ext/bc/C/rpc"
  ],
  "shortName": "metal",
  "slip44": 9005,
  "slug": "metal-c-chain",
  "testnet": false
} as const satisfies Chain;