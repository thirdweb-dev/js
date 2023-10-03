import type { Chain } from "../src/types";
export default {
  "chain": "ALYX",
  "chainId": 1314,
  "explorers": [
    {
      "name": "alyxscan",
      "url": "https://www.alyxscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://bafkreifd43fcvh77mdcwjrpzpnlhthounc6b4u645kukqpqhduaveatf6i",
    "width": 2481,
    "height": 2481,
    "format": "png"
  },
  "infoURL": "https://www.alyxchain.com",
  "name": "Alyx Mainnet",
  "nativeCurrency": {
    "name": "Alyx Chain Native Token",
    "symbol": "ALYX",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://alyx.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.alyxchain.com"
  ],
  "shortName": "alyx",
  "slug": "alyx",
  "testnet": false
} as const satisfies Chain;