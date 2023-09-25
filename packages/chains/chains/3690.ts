import type { Chain } from "../src/types";
export default {
  "chainId": 3690,
  "chain": "BTX",
  "name": "Bittex Mainnet",
  "rpc": [
    "https://bittex.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.bittexscan.info",
    "https://rpc2.bittexscan.info"
  ],
  "slug": "bittex",
  "faucets": [],
  "nativeCurrency": {
    "name": "Bittex",
    "symbol": "BTX",
    "decimals": 18
  },
  "infoURL": "https://bittexscan.com",
  "shortName": "btx",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "bittexscan",
      "url": "https://bittexscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;