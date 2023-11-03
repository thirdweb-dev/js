import type { Chain } from "../types";
export default {
  "chain": "ZYX",
  "chainId": 55,
  "explorers": [
    {
      "name": "zyxscan",
      "url": "https://zyxscan.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://zyx.network/",
  "name": "Zyx Mainnet",
  "nativeCurrency": {
    "name": "Zyx",
    "symbol": "ZYX",
    "decimals": 18
  },
  "networkId": 55,
  "rpc": [
    "https://zyx.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://55.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-1.zyx.network/",
    "https://rpc-2.zyx.network/",
    "https://rpc-3.zyx.network/",
    "https://rpc-4.zyx.network/",
    "https://rpc-5.zyx.network/",
    "https://rpc-6.zyx.network/"
  ],
  "shortName": "ZYX",
  "slug": "zyx",
  "testnet": false
} as const satisfies Chain;