import type { Chain } from "../src/types";
export default {
  "chainId": 1314,
  "chain": "ALYX",
  "name": "Alyx Mainnet",
  "rpc": [
    "https://alyx.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.alyxchain.com"
  ],
  "slug": "alyx",
  "icon": {
    "url": "ipfs://bafkreifd43fcvh77mdcwjrpzpnlhthounc6b4u645kukqpqhduaveatf6i",
    "width": 2481,
    "height": 2481,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Alyx Chain Native Token",
    "symbol": "ALYX",
    "decimals": 18
  },
  "infoURL": "https://www.alyxchain.com",
  "shortName": "alyx",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "alyxscan",
      "url": "https://www.alyxscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;