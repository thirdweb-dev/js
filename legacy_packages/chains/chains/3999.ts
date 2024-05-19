import type { Chain } from "../src/types";
export default {
  "chain": "YCC",
  "chainId": 3999,
  "explorers": [
    {
      "name": "YuanChain Explorer",
      "url": "https://mainnet.yuan.org",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.yuan.org",
  "name": "YuanChain Mainnet",
  "nativeCurrency": {
    "name": "YCC",
    "symbol": "YCC",
    "decimals": 18
  },
  "networkId": 3999,
  "rpc": [
    "https://3999.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.yuan.org/eth"
  ],
  "shortName": "ycc",
  "slug": "yuanchain",
  "testnet": false
} as const satisfies Chain;