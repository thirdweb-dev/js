import type { Chain } from "../src/types";
export default {
  "chainId": 55,
  "chain": "ZYX",
  "name": "Zyx Mainnet",
  "rpc": [
    "https://zyx.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-1.zyx.network/",
    "https://rpc-2.zyx.network/",
    "https://rpc-3.zyx.network/",
    "https://rpc-4.zyx.network/",
    "https://rpc-5.zyx.network/",
    "https://rpc-6.zyx.network/"
  ],
  "slug": "zyx",
  "faucets": [],
  "nativeCurrency": {
    "name": "Zyx",
    "symbol": "ZYX",
    "decimals": 18
  },
  "infoURL": "https://zyx.network/",
  "shortName": "ZYX",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "zyxscan",
      "url": "https://zyxscan.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;