import type { Chain } from "../src/types";
export default {
  "name": "Zyx Mainnet",
  "chain": "ZYX",
  "rpc": [
    "https://zyx.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-1.zyx.network/",
    "https://rpc-2.zyx.network/",
    "https://rpc-3.zyx.network/",
    "https://rpc-4.zyx.network/",
    "https://rpc-5.zyx.network/",
    "https://rpc-6.zyx.network/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Zyx",
    "symbol": "ZYX",
    "decimals": 18
  },
  "infoURL": "https://zyx.network/",
  "shortName": "ZYX",
  "chainId": 55,
  "networkId": 55,
  "explorers": [
    {
      "name": "zyxscan",
      "url": "https://zyxscan.com",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "zyx"
} as const satisfies Chain;